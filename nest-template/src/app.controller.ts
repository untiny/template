import { Cache } from '@nestjs/cache-manager'
import { Controller, Get, Logger, Param, Sse } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { ApiOperation, ApiParam, ApiProduces, ApiTags } from '@nestjs/swagger'
import { RedisAdapter } from '@socket.io/redis-adapter'
import { interval, map, Observable } from 'rxjs'
import { AppService } from './app.service'
import { SocketGateway } from './socket/socket.gateway'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly socketGateway: SocketGateway,
    private readonly eventEmitter: EventEmitter2,
    private readonly cache: Cache,
  ) {}

  @Sse('sse')
  @ApiOperation({ summary: 'SSE 事件流' })
  @ApiProduces('text/event-stream')
  sse(): Observable<any> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })))
  }

  @Get()
  async getHello() {
    return this.appService.getHello()
  }

  @Get('setCache')
  async setCache() {
    const message = `设置缓存的pid:${process.pid}`
    await this.cache.set('cache:test', message)

    return message
  }

  @Get('getCache')
  async getCache() {
    const message = await this.cache.get('cache:test')
    return `在${process.pid}读取缓存：${message}`
  }

  @Get('socket-test/:pid')
  @ApiParam({ name: 'pid' })
  async socketTest(@Param('pid') room: string) {
    const redisAdapter = this.socketGateway.server.sockets.adapter as RedisAdapter
    const rooms = await redisAdapter.allRooms()
    const workerRooms = redisAdapter.rooms
    Logger.log(
      `Pid: ${process.pid}, WorkerRooms: ${Array.from(workerRooms.keys())}, Rooms: ${Array.from(rooms.keys())}`,
      AppController.name,
    )
    const sockets = await this.socketGateway.getRoomSocketIds(room)
    console.log(sockets)

    this.socketGateway.server.to(room).emit('message', `Pid: ${process.pid}`)
  }

  @Get('event-test')
  async eventTest() {
    this.eventEmitter.emit('test', process.pid)
    return `Pid: ${process.pid}`
  }

  @OnEvent('test')
  async onTest(pid: number) {
    Logger.log(`onTest: ${pid}`)
  }
}
