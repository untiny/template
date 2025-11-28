import { ToolAnnotations } from '@modelcontextprotocol/sdk/types'
import { SetMetadata } from '@nestjs/common'
import z from 'zod/v4'
import { MCP_TOOL_METADATA_KEY } from './constants'

export interface ToolOptions {
  title?: string
  description?: string
  inputSchema?: z.ZodTypeAny
  outputSchema?: z.ZodTypeAny
  annotations?: ToolAnnotations
  _meta?: Record<string, unknown>
}

export interface ToolMetadata extends ToolOptions {
  name: string
}

export function Tool(name: string, option?: ToolOptions) {
  return SetMetadata(MCP_TOOL_METADATA_KEY, {
    name,
    ...option,
  })
}
