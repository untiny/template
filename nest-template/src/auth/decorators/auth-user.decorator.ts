import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import type { Request } from 'express'

export const AuthUser = createParamDecorator((key: keyof RequestUser, ctx: ExecutionContext) => {
  let user: RequestUser | null = null

  switch (ctx.getType()) {
    case 'http': {
      const context = ctx.switchToHttp()
      const request = context.getRequest<Request>()
      user = request.user as RequestUser
      break
    }
    case 'ws':
      break
    case 'rpc':
      break
  }

  if (!user) {
    return null
  }

  return key ? user[key] : user
})
