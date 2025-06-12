import { IsEmail, IsJWT, IsStrongPassword, MaxLength } from 'class-validator'
import { Property } from 'src/common/decorators'

export class LoginDto {
  @Property({
    i18n: 'module.user.email',
    title: 'Email',
    type: String,
    example: 'i@ooix.cn',
    format: 'email',
  })
  @IsEmail()
  email: string

  @Property({
    i18n: 'module.user.password',
    title: 'Password',
    type: String,
    example: 'Password@123456',
    minLength: 8,
    maxLength: 16,
    format: 'password',
  })
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
  @Property({ i18n: 'module.token.access_token', title: 'AccessToken', type: String })
  @IsJWT()
  access_token: string

  @Property({ i18n: 'module.token.refresh_token', title: 'RefreshToken', type: String })
  @IsJWT()
  refresh_token: string
}
