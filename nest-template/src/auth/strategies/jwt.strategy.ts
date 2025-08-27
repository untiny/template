import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from 'src/generated/env'
import { AuthStrategy } from '../auth.constant'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
  constructor(readonly configService: ConfigService<Env>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    })
  }

  validate(payload: RequestUser): RequestUser {
    return payload
  }
}
