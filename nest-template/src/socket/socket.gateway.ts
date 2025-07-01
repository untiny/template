import { Logger, OnApplicationShutdown } from '@nestjs/common'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketService } from './socket.service'

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnApplicationShutdown {
  @WebSocketServer() server: Server

  constructor(private readonly socketService: SocketService) {}

  afterInit() {
    Logger.log('Socket Gateway Initialized')
  }

  handleConnection(client: Socket) {
    this.server.emit('message', `Pid: ${process.pid}, ClientId: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.server.emit('message', `Pid: ${process.pid}, ClientId: ${client.id}, Disconnected`)
  }

  onApplicationShutdown(signal?: string) {
    Logger.log(`Pid: ${process.pid}, Signal: ${signal}`, SocketGateway.name)
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() name: string, @ConnectedSocket() client: Socket) {
    const message = `Pid: ${process.pid}, ClientId: ${client.id}, Name: ${name}`
    Logger.log(message, SocketGateway.name)
    client.emit('message', message)
    return message
  }
}
