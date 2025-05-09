import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags, IntersectionType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'
import { ClsService } from 'nestjs-cls'
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
    title: '对象',
  })
  object: ValidationNestedDto

  @Property({ type: [ValidationNestedDto], title: '数组' })
  @Type(() => ValidationNestedDto)
  @ValidateNested({ each: true })
  array: ValidationNestedDto[]
}

export class CopyDto extends IntersectionType(
  ValidationDto,
) {}

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly cls: ClsService) {}

  @Get()
  getHello() {
    return this.appService.getHello()
  }

  @Post('validation')
  async validation(@Body() body: CopyDto) {
    return body
  }
}
