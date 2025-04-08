/* eslint-disable no-console */
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma, PrismaClient } from '@prisma/client'
import { blue, cyan, green } from 'kolorist'
import { Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from 'kysely'
import prismaExtensionKysely from 'prisma-extension-kysely'
import { DB } from 'prisma/generated/kysely.generated'
import { format } from 'sql-formatter'

function extendClient(prisma: PrismaService) {
  const kyselyExtension = prismaExtensionKysely({
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
  })
  return prisma.$extends(kyselyExtension)
}

export type ExtendedPrismaClient = ReturnType<typeof extendClient>

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit, OnModuleDestroy {
  private enableDebug: boolean = false

  constructor(private readonly configService: ConfigService) {
    const log: Prisma.LogDefinition[] = [
      { level: 'query', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ]

    super({ log })

    this.enableDebug = this.configService.get<string>('SQL_DEBUG') === 'true'

    this.$on('query', event => this.handleQuery(event))
    this.$on('info', event => this.handleInfo(event))
    this.$on('warn', event => this.handleWarn(event))
    this.$on('error', event => this.handleError(event))
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  public static create(configService: ConfigService): ExtendedPrismaClient {
    const prisma = new PrismaService(configService)
    return extendClient(prisma)
  }

  declare public $kysely: Kysely<DB>

  public $extendTransaction = (this as ExtendedPrismaClient).$transaction

  private handleError(event: Prisma.LogEvent) {
    Logger.error(cyan(event.message), PrismaService.name)
  }

  private handleInfo(event: Prisma.LogEvent) {
    Logger.log(cyan(event.message), PrismaService.name)
  }

  private handleWarn(event: Prisma.LogEvent) {
    Logger.warn(cyan(event.message), PrismaService.name)
  }

  private handleQuery(event: Prisma.QueryEvent) {
    if (!this.enableDebug) {
      return
    }
    const params = this.parseParams(event)
    if (Array.isArray(params)) {
      const sql = format(event.query, {
        language: 'mysql',
        keywordCase: 'upper',
        params,
      })
      console.log(sql)
    }
    else {
      const sql = format(event.query, {
        language: 'mysql',
        keywordCase: 'upper',
      })
      console.log(sql)
      console.log(blue(params))
    }
  }

  private parseParams(event: Prisma.QueryEvent): string[] | string {
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} UTC$/
    try {
      const params: unknown[] = event.params ? JSON.parse(event.params) : []
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
