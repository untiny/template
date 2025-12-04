import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { GetPromptResult, ReadResourceResult, Result } from '@modelcontextprotocol/sdk/types.js'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import z from 'zod/v4'
import { Parameters } from './decorators/parameters.decorator'
import { Prompt } from './decorators/prompt.decorator'
import { Resource } from './decorators/resource.decorator'
import { Tool } from './decorators/tool.decorator'
import { Uri } from './decorators/uri.decorator'
import { createZodSchema } from './mcp.schema'

class EchoSchema extends createZodSchema(z.object({ message: z.string() })) {}

@Injectable()
export class McpTool {
  constructor(private readonly prisma: PrismaService) {}
  @Tool('echo', {
    title: 'Echo Tool',
    description: 'Echoes back the provided message',
    outputSchema: z.object({ echo: z.string() }),
  })
  async echoTool(@Parameters() input: EchoSchema) {
    const output = { echo: `Tool echo: ${input.message}` }
    await this.prisma.user.findFirst()
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    } satisfies Result
  }

  @Resource('echo', new ResourceTemplate('echo://{message}', { list: undefined }), {
    title: 'Echo Resource',
    description: 'Echoes back messages as resources',
  })
  async echoResource(@Uri() uri: URL, @Parameters('message') message: string) {
    return {
      contents: [
        {
          uri: uri.href,
          text: `Resource echo: ${message}`,
        },
      ],
    } satisfies ReadResourceResult
  }

  @Resource('resource', 'resource://mcp', {
    title: 'Resource Resource',
    description: 'Resource for MCP',
  })
  async resourceResource(@Uri() uri: URL) {
    return {
      contents: [
        {
          uri: uri.href,
          text: `Are you ok?`,
        },
      ],
    } satisfies ReadResourceResult
  }

  @Prompt('echo', {
    title: 'Echo Prompt',
    description: 'Creates a prompt to process a message',
    argsSchema: EchoSchema.schema,
  })
  async echoPrompt(@Parameters<EchoSchema>('message') message: string) {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please process this message: ${message}`,
          },
        },
      ],
    } satisfies GetPromptResult
  }
}
