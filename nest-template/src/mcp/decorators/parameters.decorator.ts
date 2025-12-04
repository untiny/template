import { createParamDecorator, PipeTransform, Type } from '@nestjs/common'
import { get } from 'lodash'
import { ZodObject } from 'zod'
import { ZodSchema } from '../mcp.schema'
import { MCP_SCHEMA_METADATA_KEY } from './constants'

export function Parameters(): ParameterDecorator
export function Parameters(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator
export function Parameters<T extends object>(
  property: keyof T,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator
export function Parameters(...dataOrPipes: any[]): ParameterDecorator {
  return createParamDecorator(
    (key, ctx) => {
      const request = ctx.switchToHttp().getRequest()
      const parameters: Record<string, unknown> = request?.mcp?.parameters ?? {}
      return key ? get(parameters, key) : parameters
    },
    [
      (target, key, index) => {
        const types = Reflect.getMetadata('design:paramtypes', target, key as string)
        const paramType = types[index] as ZodSchema
        const schema = paramType?.schema

        if (schema instanceof ZodObject) {
          Reflect.defineMetadata(MCP_SCHEMA_METADATA_KEY, schema, target, key as string)
        }
      },
    ],
  )(...dataOrPipes)
}
