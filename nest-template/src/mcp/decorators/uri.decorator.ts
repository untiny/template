import { createParamDecorator } from '@nestjs/common'
import { get } from 'lodash'

export function Uri(): ParameterDecorator {
  return createParamDecorator((key, ctx) => {
    const request = ctx.switchToHttp().getRequest()
    const uri: Record<string, unknown> = request?.mcp?.uri ?? {}
    return key ? get(uri, key) : uri
  })()
}
