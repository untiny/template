import type { NestExpressApplication } from '@nestjs/platform-express'
import process from 'node:process'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import consola from 'consola'
import { AppModule } from './app.module'
import { useServerUrl } from './common/use-server-url'
import { useSwagger } from './common/use-swagger'
import { useWinston } from './common/use-winston'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: useWinston(),
  })

  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('APP_PORT', 3000)

  app.enableShutdownHooks()

  await useSwagger(app)

  process?.on('SIGINT', async () => {
    consola.info('Shutting down...')
    await app.close()
  })

  await app.listen(port)

  await useServerUrl(app)

  process?.send?.('ready')
}

bootstrap().catch((error) => {
  consola.error(error)
  process?.exit?.(1)
})
