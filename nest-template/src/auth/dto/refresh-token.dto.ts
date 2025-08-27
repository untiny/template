import { PickType } from '@nestjs/swagger'
import { TokenResponseDto } from './login.dto'

export class RefreshTokenDto extends PickType(TokenResponseDto, ['refresh_token']) {}
