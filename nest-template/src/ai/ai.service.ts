import { Injectable, Logger } from '@nestjs/common'
import { Schema, ToolSet, tool } from 'ai'
import { AiContext } from './ai.context'
import { ToolHandler } from './ai.interfaces'

@Injectable()
export class AiService {
  private logger = new Logger(AiService.name)
  private tools: Map<string, ToolHandler> = new Map()

  registerTool(name: string, handler: ToolHandler) {
    if (this.tools.has(name)) {
      this.logger.warn(`Tool ${name} is already registered, overwriting`)
    }
    this.tools.set(name, handler)
    this.logger.log(`Tool ${name} registered`)
  }

  getTool(name: string): ToolHandler | undefined {
    return this.tools.get(name)
  }

  getTools(): Map<string, ToolHandler> {
    return this.tools
  }

  generateTools(context: AiContext): ToolSet {
    const tools: ToolSet = {}
    for (const [name, { metadata, handler }] of this.tools) {
      tools[name] = tool<unknown, unknown>({
        name,
        description: metadata.description,
        inputSchema: metadata.inputSchema as Schema,
        outputSchema: metadata.outputSchema as Schema,
        execute: (input, options) => {
          context.params = input
          context.toolCallOptions = options
          return handler(context)
        },
      })
    }
    return tools
  }
}
