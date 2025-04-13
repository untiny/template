import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsJWT, IsStrongPassword, MaxLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ title: 'Email', type: String, example: 'i@ooix.cn' })
  @IsEmail()
  email: string

  @ApiProperty({ title: 'Password', type: String, example: 'Password@123456' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @MaxLength(16)
  password: string
}

export class TokenResponseDto {
  @ApiProperty({ title: 'AccessToken', type: String })
  access_token: string

  @ApiProperty({ title: 'RefreshToken', type: String })
  @IsJWT()
  refresh_token: string
}
