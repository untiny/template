import { Logger, OnApplicationShutdown } from '@nestjs/common'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { RedisAdapter } from '@socket.io/redis-adapter'
import { Server, Socket } from 'socket.io'
import { SocketService } from './socket.service'

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnApplicationShutdown {
  @WebSocketServer() server: Server

  constructor(private readonly socketService: SocketService,) {}

  get redisAdapter() {
    return this.server.sockets.adapter as RedisAdapter
  }

  afterInit(server: Server) {
    Logger.log('Initialized', SocketGateway.name)
    server.sockets.adapter.on('create-room', (room: string) => {
      Logger.log(`创建了 ${room} 房间`, SocketGateway.name)
    })
    server.sockets.adapter.on('delete-room', (room: string) => {
      Logger.log(`删除了 ${room} 房间`, SocketGateway.name)
    })
    server.sockets.adapter.on('join-room', (room: string, id: string) => {
      Logger.log(`socket ${id} 已加入房间 ${room}`, SocketGateway.name)
    })
    server.sockets.adapter.on('leave-room', (room: string, id: string) => {
      Logger.log(`socket ${id} 已离开房间 ${room}`, SocketGateway.name)
    })
    const redisAdapter = server.sockets.adapter as RedisAdapter
    redisAdapter.allRooms().then((rooms) => {
      Logger.verbose(`当前房间列表: ${Array.from(rooms.keys())}`, SocketGateway.name)
    }).catch((err) => {
      Logger.error(err, SocketGateway.name)
    })
  }

  async handleConnection(client: Socket) {
    Logger.log(`Pid: ${process.pid}, Rooms: ${Array.from(this.server.sockets.adapter.rooms.keys())}`, SocketGateway.name)
    await client.join(`${process.pid}`)
    this.server.emit('message', `Pid: ${process.pid}, ClientId: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.server.emit('message', `Pid: ${process.pid}, ClientId: ${client.id}, Disconnected`)
  }

  onApplicationShutdown(signal?: string) {
    Logger.log(`Pid: ${process.pid}, Signal: ${signal}`, SocketGateway.name)
  }

  async getRoomSockets(room: string[] | string) {
    const sockets: Pick<Socket, 'id' | 'handshake' | 'rooms' | 'data'>[] = await this.redisAdapter.fetchSockets({
      rooms: new Set(room),
      except: new Set(),
    })
    return sockets
  }

  async getRoomSocketIds(room: string[] | string) {
    const sockets = await this.getRoomSockets(room)
    return sockets.map(socket => socket.id)
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() name: string, @ConnectedSocket() client: Socket) {
    const message = `Pid: ${process.pid}, ClientId: ${client.id}, Name: ${name}`
    Logger.log(message, SocketGateway.name)
    client.emit('message', message)
    return message
  }
}
