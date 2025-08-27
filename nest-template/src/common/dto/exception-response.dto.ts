import { HttpStatus } from '@nestjs/common'
import { Property } from '../decorators'

export class ExceptionResponseDto {
  @Property({ type: String, example: 'Are you ok?' })
  message: string

  @Property({ type: Number, enum: HttpStatus, example: HttpStatus.BAD_REQUEST })
  status: HttpStatus

  @Property({ required: false, type: String, example: 'HttpException' })
  context?: string

  constructor(message: string, status: HttpStatus, context?: string) {
    this.message = message
    this.status = status
    this.context = context
  }
}
