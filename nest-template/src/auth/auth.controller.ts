import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/auth/decorators'
import { AuthService } from './auth.service'
import { LoginDto, TokenResponseDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ type: TokenResponseDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }

  @ApiOperation({ summary: '注册' })
  @ApiOkResponse({ type: TokenResponseDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto)
  }

  // @ApiOperation({ summary: '退出登录' })
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // async logout(@AuthUser() user: RequestUser) {
  //   return user
  // }

  @ApiOperation({ summary: '刷新Token' })
  @ApiOkResponse({ type: TokenResponseDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return await this.authService.refreshToken(dto.refresh_token)
  }
}
