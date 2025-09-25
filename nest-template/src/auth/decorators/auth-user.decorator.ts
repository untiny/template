import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

export const AuthUser = createParamDecorator((key: keyof RequestUser, ctx: ExecutionContext) => {
  let user: RequestUser | null = null

  switch (ctx.getType()) {
    case 'http': {
      const context = ctx.switchToHttp()
      const request = context.getRequest<FastifyRequest>()
      user = (request as any).user as RequestUser
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
