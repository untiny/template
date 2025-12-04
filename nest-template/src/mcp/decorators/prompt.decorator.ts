import { ZodRawShapeCompat } from '@modelcontextprotocol/sdk/server/zod-compat.js'
import { SetMetadata } from '@nestjs/common'
import { ZodObject } from 'zod'
import { MCP_PROMPT_METADATA_KEY, MCP_SCHEMA_METADATA_KEY } from './constants'

export type PromptOptions = {
  title?: string
  description?: string
  argsSchema?: ZodObject
}

export interface PromptMetadata {
  name: string
  title?: string
  description?: string
  argsSchema?: ZodRawShapeCompat
}

export function Prompt(name: string, option?: PromptOptions): MethodDecorator {
  const metadata: PromptMetadata = { name }

  if (option?.argsSchema instanceof ZodObject) {
    metadata.argsSchema = option?.argsSchema.shape
  }

  return (target, key, descriptor) => {
    if (!metadata.argsSchema) {
      const schema = Reflect.getMetadata(MCP_SCHEMA_METADATA_KEY, target, key as string) as ZodObject
      metadata.argsSchema = schema?.shape as ZodRawShapeCompat
    }
    return SetMetadata(MCP_PROMPT_METADATA_KEY, metadata)(target, key, descriptor)
  }
}
