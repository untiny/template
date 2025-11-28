import { ZodRawShapeCompat } from '@modelcontextprotocol/sdk/server/zod-compat.js'
import { SetMetadata } from '@nestjs/common'
import { MCP_PROMPT_METADATA_KEY } from './constants'

export type PromptOptions<Args extends ZodRawShapeCompat = ZodRawShapeCompat> = {
  title?: string
  description?: string
  argsSchema?: Args
}

export interface PromptMetadata<Args extends ZodRawShapeCompat = ZodRawShapeCompat> extends PromptOptions<Args> {
  name: string
}

export function Prompt<Args extends ZodRawShapeCompat = ZodRawShapeCompat>(name: string, option?: PromptOptions<Args>) {
  return SetMetadata(MCP_PROMPT_METADATA_KEY, { name, ...option })
}
