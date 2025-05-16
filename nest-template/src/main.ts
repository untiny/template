import type { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'node:path'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { useServerUrl } from './common/use-server-url'
import { useSwagger } from './common/use-swagger'
import { useWinston } from './common/use-winston'
import { Env } from './generated/env'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: useWinston(),
  })

  const configService = app.get<ConfigService<Env>>(ConfigService)
  const port = configService.get<number>('APP_PORT', 3000)

  app.enableShutdownHooks()
  app.engine('vue', (filePath: string, options: unknown, callback: (error: Error | null, html?: string) => void) => {
    try {
      console.log(filePath, options)

      callback(null, '123')
    }
    catch (error) {
      callback(error as Error)
    }
  })
  app.setViewEngine('vue')
  app.setBaseViewsDir(join(__dirname, '..', 'views'))

  await useSwagger(app)

  process?.on('SIGINT', async () => {
    Logger.log('Shutting down...', 'Bootstrap')
    await app.close()
  })

  await app.listen(port)

  await useServerUrl(app)

  process?.send?.('ready')
}

bootstrap().catch((error) => {
  Logger.error(error)
  process?.exit?.(1)
})
