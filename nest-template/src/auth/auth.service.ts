import { hash } from 'node:crypto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import { isEqual } from 'lodash'
import { Env } from 'src/generated/env'
import { UserService } from 'src/user/user.service'
import { LoginDto, TokenResponseDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  private accessJwt: JwtSignOptions
  private refreshJwt: JwtSignOptions

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly configService: ConfigService<Env>,
  ) {
    this.accessJwt = {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET') as string,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    }
    this.refreshJwt = {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET') as string,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    }
  }

  async validateUser(email: string, password: string): Promise<RequestUser | null> {
    const user = await this.userService.getUserByEmail(email)
    if (!user) {
      return null
    }
    const hashPassword = hash('sha1', password)
    return isEqual(user.password, hashPassword) ? { id: user.id } : null
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误')
    }
    return await this.generateToken(user)
  }

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    await this.userService.checkEmailExist(registerDto.email)
    registerDto.password = hash('sha1', registerDto.password)
    const user = await this.userService.create(registerDto)
    return await this.generateToken({ id: user.id })
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    // 判断是否为已失效的token, 避免重复刷新
    const isExpired = await this.cache.get<boolean>(`expired_refresh_token:${refreshToken}`)

    if (isExpired) {
      throw new UnauthorizedException('刷新令牌已失效')
    }

    try {
      const user = await this.jwtService.verifyAsync<RequestUser>(refreshToken, this.refreshJwt)
      // 计算剩余过期时间
      const remainingTime = (user.exp! - Date.now() / 1000) * 1000
      await this.cache.set(`expired_refresh_token:${refreshToken}`, true, remainingTime)
      return await this.generateToken(user)
    }
    catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('刷新令牌已过期')
      }
      throw error
    }
  }

  async generateToken(user: RequestUser): Promise<TokenResponseDto> {
    const accessToken = await this.jwtService.signAsync({ id: user.id }, this.accessJwt)
    const refreshToken = await this.jwtService.signAsync({ id: user.id }, this.refreshJwt)
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }
}
