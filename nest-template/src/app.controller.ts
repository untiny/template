import { Controller, Get, Render } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ClsService } from 'nestjs-cls'
import { AppService } from './app.service'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly cls: ClsService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: 'Hello World!',
    }
  }
}
