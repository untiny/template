import { IsNotEmpty, IsString } from 'class-validator'
import { Property } from 'src/common/decorators'
import { LoginDto } from './login.dto'

export class RegisterDto extends LoginDto {
  @Property({ i18n: 'module.user.name', title: '用户名', type: String, example: 'untiny', maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  name: string
}
