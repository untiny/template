import { IsEmail, IsJWT, IsStrongPassword } from 'class-validator'
import { Property } from 'src/common/decorators'

export class LoginDto {
  @Property({
    i18n: 'module.user.email',
    title: 'Email',
    type: String,
    example: 'i@ooix.cn',
  })
  @IsEmail()
  email: string

  @Property({
    i18n: 'module.user.password',
    title: 'Password',
    type: String,
    example: 'Password@123456',
    maxLength: 16,
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
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
