import { join } from 'node:path'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { useServerUrl } from './common/use-server-url'
import { useSwagger } from './common/use-swagger'
import { useWinston } from './common/use-winston'
import { Env } from './generated/env'
import { SocketAdapter } from './socket/socket.adapter'

async function bootstrap() {
  // 全局 BigInt 序列化
  if (!Reflect.get(BigInt.prototype, 'toJSON')) {
    Reflect.set(BigInt.prototype, 'toJSON', function () {
      return this.toString()
    })
  }

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: useWinston(),
    cors: true,
  })

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    decorateReply: false,
  })

  const configService = app.get<ConfigService<Env>>(ConfigService)
  const port = configService.get<number>('APP_PORT', 3000)

  app.enableShutdownHooks()

  const socketAdapter = new SocketAdapter(app)
  await socketAdapter.connectToRedis(configService)
  app.useWebSocketAdapter(socketAdapter)

  await useSwagger(app)

  await app.listen(port, '0.0.0.0')

  await useServerUrl(app)

  process?.send?.('ready')
}

bootstrap().catch((error) => {
  Logger.error(error)
  process?.exit?.(1)
})
