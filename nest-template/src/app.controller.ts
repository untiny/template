import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Controller, Get, Inject, Logger, Param } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { ApiParam, ApiTags } from '@nestjs/swagger'
import { RedisAdapter } from '@socket.io/redis-adapter'
import { Cache } from 'cache-manager'
import { ClsService } from 'nestjs-cls'
import { AppService } from './app.service'
import { SocketGateway } from './socket/socket.gateway'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly socketGateway: SocketGateway,
    private readonly cls: ClsService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get()
  async getHello() {
    await this.cacheManager.set('cache:test', `设置缓存的pid:${process.pid}`)
    return {
      message: 'Hello World!',
    }
  }

  @Get('setCache')
  async setCache() {
    const message = `设置缓存的pid:${process.pid}`
    await this.cacheManager.set('cache:test', message)

    return message
  }

  @Get('getCache')
  async getCache() {
    const message = await this.cacheManager.get('cache:test')
    return `在${process.pid}读取缓存：${message}`
  }

  @Get('socket-test/:pid')
  @ApiParam({ name: 'pid' })
  async socketTest(@Param('pid') room: string) {
    const redisAdapter = this.socketGateway.server.sockets.adapter as RedisAdapter
    const rooms = await redisAdapter.allRooms()
    const workerRooms = redisAdapter.rooms
    Logger.log(`Pid: ${process.pid}, WorkerRooms: ${Array.from(workerRooms.keys())}, Rooms: ${Array.from(rooms.keys())}`, AppController.name)
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
