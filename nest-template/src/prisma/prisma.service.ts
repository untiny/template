/* eslint-disable no-console */
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UnwrapTuple } from '@prisma/client/runtime/library'
import { blue, green } from 'kolorist'
import { Kysely } from 'kysely'
import { format, FormatOptionsWithLanguage } from 'sql-formatter'
import { DB } from 'src/generated/kysely'
import { Prisma, PrismaClient } from 'src/generated/prisma/client'
import { createKysely } from './extends/kysely.extend'
import { snowflakeExtend } from './extends/snowflake.extend'
import { PrismaContextWithKysely, PrismaTransactionFnWithKysely } from './prisma.interface'

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit, OnModuleDestroy {
  public $kysely: Kysely<DB>

  constructor(private readonly configService: ConfigService) {
    const log: Prisma.LogDefinition[] = [
      { level: 'query', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ]

    super({ log })

    const enableDebug = this.configService.get<string>('SQL_DEBUG', 'false') === 'true'

    if (enableDebug) {
      this.$on('query', event => this.handleQuery(event))
    }
    this.$on('info', event => this.handleInfo(event))
    this.$on('warn', event => this.handleWarn(event))
    this.$on('error', event => this.handleError(event))

    this.$kysely = createKysely(this)
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  public static create(configService: ConfigService) {
    const prisma = new PrismaService(configService)
    return prisma.$extends(snowflakeExtend)
  }

  public $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>
  public $transaction<R>(fn: PrismaTransactionFnWithKysely<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>
  public $transaction(fn: Prisma.PrismaPromise<any>[] | PrismaTransactionFnWithKysely, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): ReturnType<PrismaClient['$transaction']> {
    if (typeof fn === 'function') {
      return super.$transaction(async (tx) => {
        let kyselyInstance: Kysely<DB>
        const prismaWithKysely = new Proxy(tx, {
          get: (target, prop, receiver) => {
            if (prop === '$kysely') {
              if (!kyselyInstance) {
                kyselyInstance = createKysely(target)
              }
              return kyselyInstance
            }
            return Reflect.get(target, prop, receiver)
          },
        })
        return await fn(prismaWithKysely as PrismaContextWithKysely)
      }, options)
    }
    return super.$transaction(fn, options)
  }

  private handleError(event: Prisma.LogEvent) {
    event.message = event.message.split('\n').pop() as string
    Logger.error(`${event.target} ${event.message}`, null, PrismaService.name)
  }

  private handleInfo(event: Prisma.LogEvent) {
    Logger.log(event.message, PrismaService.name)
  }

  private handleWarn(event: Prisma.LogEvent) {
    Logger.warn(event.message, PrismaService.name)
  }

  private handleQuery(event: Prisma.QueryEvent) {
    const params = this.parseParams(event)
    const config: FormatOptionsWithLanguage = {
      language: 'mysql',
      keywordCase: 'upper',
    }
    if (Array.isArray(params)) {
      config.params = params
      const sql = format(event.query as string, config)
      console.log(sql)
    }
    else {
      const sql = format(event.query as string, config)
      console.log(sql)
      console.log(blue(params))
    }
  }

  private parseParams(event: Prisma.QueryEvent): string[] | string {
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} UTC$/
    try {
      const params: unknown[] = event.params
        ? JSON.parse((event.params as string).replace(
            /(?<=\[|\s)(-?\d{16,})(?=\s*[,|\]])/g,
            '"$1"'
          ))
        : []
      return params.map((param) => {
        if (typeof param === 'string') {
          if (dateRegex.test(param)) {
            return blue(`'${param.replace(' UTC', '')}'`)
          }
          return blue(`'${param}'`)
        }
        return green(JSON.stringify(param))
      })
    }
    catch {
      return event.params
    }
  }
}
