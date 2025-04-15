import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'
import { AppService } from './app.service'
import { Property } from './common/decorators'

export class ValidationNestedDto {
  @Property({ title: '字符串' })
  @IsString()
  @IsNotEmpty()
  string: string
}

export class ValidationDto {
  @Property({ title: '字符串' })
  @IsString()
  @IsNotEmpty()
  string: string

  @Property({ title: '数字' })
  @IsNumber()
  number: number

  @Property({
    type: ValidationNestedDto,
    title: {
      zh_CN: '对象',
      en_US: 'Object',
    },
  })
  @Type(() => ValidationNestedDto)
  @ValidateNested()
  object: ValidationNestedDto

  @Property({ type: [ValidationNestedDto], title: '数组' })
  @Type(() => ValidationNestedDto)
  @ValidateNested({ each: true })
  array: ValidationNestedDto[]
}

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello()
  }

  @Post('validation')
  async validation(@Body() body: ValidationDto) {
    return body
  }
}
