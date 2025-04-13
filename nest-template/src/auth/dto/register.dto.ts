import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { LoginDto } from './login.dto'

export class RegisterDto extends LoginDto {
  @ApiProperty({ title: '用户名', type: String, example: 'untiny' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string
}
