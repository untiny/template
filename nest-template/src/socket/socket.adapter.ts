import { ConfigService } from '@nestjs/config'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { Server, ServerOptions } from 'socket.io'
import { Env } from 'src/generated/env'

export class SocketAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>

  async connectToRedis(configService: ConfigService<Env>): Promise<void> {
    const pubClient = createClient({
      url: configService.getOrThrow<string>('REDIS_URL'),
      password: configService.getOrThrow<string>('REDIS_PASSWORD'),
    })

    const subClient = pubClient.duplicate()

    await Promise.all([pubClient.connect(), subClient.connect()])

    const name = configService.get<string>('APP_NAME')

    this.adapterConstructor = createAdapter(pubClient, subClient, {
      key: `${name ? `${name}.` : ''}socket.io`,
    })
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    if (!this.adapterConstructor) {
      throw new Error('Redis adapter not initialized. Call connectToRedis() first.')
    }
    const server: Server = super.createIOServer(port, options)
    server.adapter(this.adapterConstructor)
    return server
  }
}
