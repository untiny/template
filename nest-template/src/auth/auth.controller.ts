import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthUser, Public } from 'src/auth/decorators'
import { AuthService } from './auth.service'
import { LoginDto, TokenResponseDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalGuard } from './guards/local.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ type: TokenResponseDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@AuthUser() user: RequestUser, @Body() _: LoginDto) {
    return await this.authService.login(user)
  }

  @ApiOperation({ summary: '注册' })
  @ApiOkResponse({ type: TokenResponseDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto)
  }

  @ApiOperation({ summary: '退出登录' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@AuthUser() user: RequestUser) {
    // 干掉redis中的刷新token
    return user
  }

  @ApiOperation({ summary: '刷新Token' })
  @ApiOkResponse({ type: TokenResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return await this.authService.refreshToken(dto.refresh_token)
  }
}
