import { ToolAnnotations } from '@modelcontextprotocol/sdk/types'
import { SetMetadata } from '@nestjs/common'
import { ZodObject } from 'zod'
import { MCP_SCHEMA_METADATA_KEY, MCP_TOOL_METADATA_KEY } from './constants'

export interface ToolOptions {
  title?: string
  description?: string
  inputSchema?: ZodObject
  outputSchema?: ZodObject
  annotations?: ToolAnnotations
  _meta?: Record<string, unknown>
}

export interface ToolMetadata {
  name: string
  title?: string
  description?: string
  inputSchema?: ZodObject
  outputSchema?: ZodObject
  annotations?: ToolAnnotations
  _meta?: Record<string, unknown>
}

export function Tool(name: string, option?: ToolOptions): MethodDecorator {
  const metadata: ToolMetadata = { name }

  if (option?.inputSchema instanceof ZodObject) {
    metadata.inputSchema = option?.inputSchema
  }

  if (option?.outputSchema instanceof ZodObject) {
    metadata.outputSchema = option?.outputSchema
  }

  return (target, key, descriptor) => {
    if (!metadata.inputSchema) {
      metadata.inputSchema = Reflect.getMetadata(MCP_SCHEMA_METADATA_KEY, target, key as string) as ZodObject
    }
    return SetMetadata(MCP_TOOL_METADATA_KEY, metadata)(target, key, descriptor)
  }
}
