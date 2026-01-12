import { AiContext } from './ai.context'
import { ToolMetadata } from './decorators'

export type ContextCallback = (context: AiContext) => any

export type ParamFactory<TOutput = any> = (key: string | null, context: AiContext) => TOutput

export interface ToolHandler {
  metadata: ToolMetadata
  handler: ContextCallback
}
