import { createParamDecorator, PipeTransform, Type } from '@nestjs/common'
import { get } from 'lodash'

export function Extra(): ParameterDecorator
export function Extra(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator
export function Extra(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator
export function Extra(...dataOrPipes: any[]): ParameterDecorator {
  return createParamDecorator((key, ctx) => {
    const request = ctx.switchToHttp().getRequest()
    const extra: Record<string, unknown> = request?.mcp?.extra ?? {}
    return key ? get(extra, key) : extra
  })(...dataOrPipes)
}
