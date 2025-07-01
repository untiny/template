import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ClsService } from 'nestjs-cls'
import { AppService } from './app.service'
import { SocketGateway } from './socket/socket.gateway'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly socketGateway: SocketGateway, private readonly cls: ClsService) {}

  @Get()
  getHello() {
    return {
      message: 'Hello World!',
    }
  }

  @Get('socket-test')
  async socketTest() {
    this.socketGateway.server.emit('message', `Pid: ${process.pid}`)
  }
}
