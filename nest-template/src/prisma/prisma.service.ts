import { INestApplication, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import consola from 'consola'
import { blue, green } from 'kolorist'
import { Kysely } from 'kysely'
import { format, FormatOptionsWithLanguage } from 'sql-formatter'
import { DB } from 'src/generated/kysely'
import { Prisma, PrismaClient } from 'src/generated/prisma/client'
import { useKysely } from '../common/use-kysely'

function extendClient(prisma: PrismaService) {
  return prisma.$extends(useKysely())
}

export type ExtendedPrismaClient = ReturnType<typeof extendClient>

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel | 'beforeExit'> implements OnModuleInit, OnModuleDestroy {
  private enableDebug: boolean = false

  constructor(private readonly configService: ConfigService) {
    const log: Prisma.LogDefinition[] = [
      { level: 'query', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ]

    super({ log })

    this.enableDebug = this.configService.get<string>('SQL_DEBUG', 'false') === 'true'

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

  async enableShutdownHooks(app: INestApplication) {
    Logger.log('Enable shutdown hooks', PrismaService.name)
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }

  public static create(configService: ConfigService): ExtendedPrismaClient {
    const prisma = new PrismaService(configService)
    return extendClient(prisma)
  }

  declare public $kysely: Kysely<DB>

  public $extendTransaction = (this as ExtendedPrismaClient).$transaction

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
    if (!this.enableDebug) {
      return
    }
    const params = this.parseParams(event)
    const config: FormatOptionsWithLanguage = {
      language: 'mysql',
      keywordCase: 'upper',
    }
    if (Array.isArray(params)) {
      config.params = params
      const sql = format(event.query as string, config)
      consola.log(sql)
    }
    else {
      const sql = format(event.query as string, config)
      consola.log(sql)
      consola.log(blue(params))
    }
  }

  private parseParams(event: Prisma.QueryEvent): string[] | string {
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} UTC$/
    try {
      const params: unknown[] = event.params ? JSON.parse(event.params as string) : []
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
