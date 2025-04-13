import { HttpStatus } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ExceptionResponseDto {
  @ApiProperty({ type: String, example: 'Are you ok?' })
  message: string

  @ApiProperty({ type: Number, enum: HttpStatus, example: HttpStatus.BAD_REQUEST })
  status: HttpStatus

  @ApiPropertyOptional({ type: String, example: 'HttpException' })
  context?: string

  constructor(message: string, status: HttpStatus, context?: string,) {
    this.message = message
    this.status = status
    this.context = context
  }
}
