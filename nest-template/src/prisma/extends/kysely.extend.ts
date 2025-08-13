import { CompiledQuery, DatabaseConnection, DeleteQueryNode, Driver, InsertQueryNode, Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler, QueryResult, TransactionSettings, UpdateQueryNode } from 'kysely'
import { DB } from 'src/generated/kysely'
import { PrismaContext } from '../prisma.interface'

/**
 * A Kysely database connection that uses Prisma as the driver
 */
export class PrismaConnection implements DatabaseConnection {
  constructor(private readonly prisma: PrismaContext) {}

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

        await this.prisma.$executeRawUnsafe(sql, ...parameters),
      )
      return {
        rows: [],
        numAffectedRows,
        numChangedRows: numAffectedRows,
      }
    }

    // Otherwise, execute it with $queryRawUnsafe to get the query results
    const rows: R[] = await this.prisma.$queryRawUnsafe(sql, ...parameters)
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

export class PrismaDriver<T extends PrismaContext> implements Driver {
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

export function createKysely<T extends PrismaContext>(client: T) {
  return new Kysely<DB>({
    dialect: {
      // This is where the magic happens!
      createDriver: () => new PrismaDriver(client),
      // Don't forget to customize these to match your database!
      createAdapter: () => new MysqlAdapter(),
      createIntrospector: db => new MysqlIntrospector(db),
      createQueryCompiler: () => new MysqlQueryCompiler(),
    },
    plugins: [
      // Add your favorite plugins here!
    ],
  })
}
