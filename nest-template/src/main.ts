import { join } from 'node:path'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { useServerUrl } from './common/use-server-url'
import { useSwagger } from './common/use-swagger'
import { useWinston } from './common/use-winston'
import { Env } from './generated/env'
import { SocketAdapter } from './socket/socket.adapter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: useWinston(),
  })

  app.set('json replacer', (_: string, value: any) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }
    return value
  })

  app.useStaticAssets(join(__dirname, '..', 'public'))

  const configService = app.get<ConfigService<Env>>(ConfigService)
  const port = configService.get<number>('APP_PORT', 3000)

  app.enableShutdownHooks()

  const socketAdapter = new SocketAdapter(app)
  await socketAdapter.connectToRedis(configService)
  app.useWebSocketAdapter(socketAdapter)

  await useSwagger(app)

  await app.listen(port)

  await useServerUrl(app)

  process?.send?.('ready')
}

bootstrap().catch((error) => {
  Logger.error(error)
  process?.exit?.(1)
})
