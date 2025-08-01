import { PrismaClient } from '@prisma/client/extension'
import { CompiledQuery, DatabaseConnection, DeleteQueryNode, Driver, InsertQueryNode, Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler, QueryResult, TransactionSettings, UpdateQueryNode } from 'kysely'
import { DB } from 'src/generated/kysely'
import { Prisma } from 'src/generated/prisma/client'

/**
 * A Kysely database connection that uses Prisma as the driver
 */
export class PrismaConnection implements DatabaseConnection {
  constructor(private readonly prisma: PrismaClient) {}

  async executeQuery<R>(
    compiledQuery: CompiledQuery<unknown>,
  ): Promise<QueryResult<R>> {
    const { sql, parameters, query } = compiledQuery

    // Delete, update and insert queries return the number of affected rows if no returning clause is specified
    const supportsReturning
      = DeleteQueryNode.is(query)
        || UpdateQueryNode.is(query)
        || InsertQueryNode.is(query)
    const shouldReturnAffectedRows = supportsReturning && !query.returning

    // Execute the query with $executeRawUnsafe to get the number of affected rows
    if (shouldReturnAffectedRows) {
      const numAffectedRows = BigInt(
        // eslint-disable-next-line ts/no-unsafe-argument
        await this.prisma.$executeRawUnsafe(sql, ...parameters),
      )
      return {
        rows: [],
        numAffectedRows,
        numChangedRows: numAffectedRows,
      }
    }

    // Otherwise, execute it with $queryRawUnsafe to get the query results
    const rows = await this.prisma.$queryRawUnsafe(sql, ...parameters)
    return { rows }
  }

  streamQuery<R>(
    _compiledQuery: CompiledQuery<unknown>,
    _chunkSize?: number | undefined,
  ): AsyncIterableIterator<QueryResult<R>> {
    throw new Error(
      'prisma-extension-kysely does not support streaming queries',
    )
  }
}

export class PrismaDriver<T extends PrismaClient> implements Driver {
  constructor(private readonly prisma: T) {}

  async init(): Promise<void> {}

  async acquireConnection(): Promise<DatabaseConnection> {
    return new PrismaConnection(this.prisma)
  }

  async beginTransaction(
    _connection: DatabaseConnection,
    _settings: TransactionSettings,
  ): Promise<void> {
    throw new Error('prisma-extension-kysely does not support transactions')
  }

  async commitTransaction(_connection: DatabaseConnection): Promise<void> {
    throw new Error('prisma-extension-kysely does not support transactions')
  }

  async rollbackTransaction(_connection: DatabaseConnection): Promise<void> {
    throw new Error('prisma-extension-kysely does not support transactions')
  }

  async releaseConnection(_connection: DatabaseConnection): Promise<void> {}

  async destroy(): Promise<void> {}
}

/**
 * The configuration object for the Prisma Kysely extension
 */
export interface PrismaKyselyExtensionArgs<Database> {
  /**
   * The Kysely instance to provide to the Prisma client
   */
  // kysely: Kysely<Database>;
  kysely: (driver: PrismaDriver<unknown>) => Kysely<Database>
};

export class PrismaKyselyExtensionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PrismaKyselyExtensionError'
  }
}

/**
 * Define a Prisma extension that adds Kysely query builder methods to the Prisma client
 */
export function useKysely() {
  const extensionArgs: PrismaKyselyExtensionArgs<DB> = {
    kysely: driver =>
      new Kysely<DB>({
        dialect: {
          // This is where the magic happens!
          createDriver: () => driver,
          // Don't forget to customize these to match your database!
          createAdapter: () => new MysqlAdapter(),
          createIntrospector: db => new MysqlIntrospector(db),
          createQueryCompiler: () => new MysqlQueryCompiler(),
        },
        plugins: [
          // Add your favorite plugins here!
        ],
      }),
  }

  return Prisma.defineExtension((client) => {
    // Check if the client is already extended
    if ('$kysely' in client) {
      throw new PrismaKyselyExtensionError(
        'The Prisma client is already extended with Kysely',
      )
    }

    const driver = new PrismaDriver(client)
    const kysely = extensionArgs.kysely(driver)

    const extendedClient = client.$extends({
      name: 'prisma-extension-kysely',
      client: {
        /**
         * The Kysely instance used by the Prisma client
         */
        $kysely: kysely,
      },
    })

    // Wrap the $transaction method to attach a fresh Kysely instance to the transaction client
    const kyselyTransaction
      = (target: typeof extendedClient) =>
        (...args: Parameters<typeof target.$transaction>) => {
          if (typeof args[0] === 'function') {
          // If the first argument is a function, add a fresh Kysely instance to the transaction client
            const [fn, options] = args
            return target.$transaction(async (tx) => {
            // The Kysely instance should call the transaction client, not the original client
              const driver = new PrismaDriver(tx)
              const kysely = extensionArgs.kysely(driver)
              tx.$kysely = kysely
              return fn(tx)
            }, options)
          }
          else {
          // Otherwise, just call the original $transaction method
            return target.$transaction(...args)
          }
        }

    // Attach the wrapped $transaction method to the extended client using a proxy
    const extendedClientProxy = new Proxy(extendedClient, {
      get: (target, prop, receiver) => {
        if (prop === '$transaction') {
          return kyselyTransaction(target)
        }

        return Reflect.get(target, prop, receiver)
      },
    })

    return extendedClientProxy
  })
}
