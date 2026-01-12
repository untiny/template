import { SetMetadata } from '@nestjs/common'
import { Schema } from 'ai'
import { AI_TOOL_METADATA_KEY } from '../ai.constants'

export interface ToolOptions {
  name: string
  description?: string
  inputSchema?: any
  outputSchema?: any
}

export interface ToolMetadata extends ToolOptions {
  inputSchema?: Schema
  outputSchema?: Schema
}

export function Tool(metadata: ToolOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    return SetMetadata(AI_TOOL_METADATA_KEY, metadata)(target, propertyKey, descriptor)
  }
}
