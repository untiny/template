import type { NestExpressApplication } from '@nestjs/platform-express'
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
