import { hash } from 'node:crypto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import { isEqual } from 'lodash'
import ms from 'ms'
import { Env } from 'src/generated/env'
import { UserService } from 'src/user/user.service'
import { TokenResponseDto } from './dto/login.dto'
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
      secret: this.configService.get<string>('JWT_ACCESS_SECRET') as string,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    }
    this.refreshJwt = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') as string,
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

  async login(user: RequestUser): Promise<TokenResponseDto> {
    return await this.generateToken(user)
  }

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    await this.userService.checkEmailExist(registerDto.email)
    registerDto.password = hash('sha1', registerDto.password)
    const user = await this.userService.create(registerDto)
    return await this.generateToken({ id: user.id })
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    let user: RequestUser | null = null
    try {
      user = await this.jwtService.verifyAsync<RequestUser>(refreshToken, this.refreshJwt)
    }
    catch (error) {
      if (error instanceof TokenExpiredError) {
        user = this.jwtService.decode<RequestUser>(refreshToken, { json: true })
      }
    }
    if (user) {
      const cacheRefreshToken = await this.cache.get<string>(`refresh_token:${user.id}`)
      if (refreshToken === cacheRefreshToken) {
        return await this.generateToken(user, true)
      }
    }

    throw new UnauthorizedException('刷新令牌已过期或无效')
  }

  async generateToken(user: RequestUser, reset?: boolean): Promise<TokenResponseDto> {
    if (reset) {
      await this.cache.del(`refresh_token:${user.id}`)
    }
    const accessToken = await this.jwtService.signAsync({ id: user.id }, this.accessJwt)
    let refreshToken = await this.cache.get<string>(`refresh_token:${user.id}`)
    if (!refreshToken) {
      refreshToken = await this.jwtService.signAsync({ id: user.id }, this.refreshJwt)
      const ttl = Number(ms('7d')) + Number(ms('10m')) // 允许过期十分钟内刷新
      await this.cache.set(`refresh_token:${user.id}`, refreshToken, ttl)
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }
}
