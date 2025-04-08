import type { NestExpressApplication } from '@nestjs/platform-express'
import process from 'node:process'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { useServerUrl } from './common/use-server-url'
import { useSwagger } from './common/use-swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('APP_PORT', 3000)

  app.enableShutdownHooks()

  await useSwagger(app)

  await app.listen(port)

  await useServerUrl(app)

  process?.on('SIGINT', async () => {
    await app.close()
  })
  process?.send?.('ready')
}

bootstrap().catch((error) => {
  console.error('Error starting the server:', error)
  process?.exit?.(1)
})
