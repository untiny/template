import { Body, Injectable } from '@nestjs/common'
import z from 'zod/v4'
import { Prompt } from './decorators/prompt.decorator'
import { Resource } from './decorators/resource.decorator'
import { Tool } from './decorators/tool.decorator'

@Injectable()
export class McpTool {
  @Tool('echo', {
    title: 'Echo Tool',
    description: 'Echoes back the provided message',
    inputSchema: z.object({ message: z.string() }),
    outputSchema: z.object({ echo: z.string() }),
  })
  async echoTool({ message }: { message: string }, x, @Body() body: any) {
    console.log(body)

    const output = { echo: `Tool echo: ${message}` }
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }

  @Tool('test', {
    title: 'test Tool',
    description: 'test Tool',
    outputSchema: z.object({ echo: z.string() }),
  })
  async test({ message }: { message: string }, x, @Body() body: any) {
    console.log(body)

    const output = { echo: `test` }
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }

  @Resource('echo', 'resource://echo/{message}', {
    title: 'Echo Resource',
    description: 'Echoes back messages as resources',
  })
  async echoResource(uri: URL, { message }: { message: string }) {
    return {
      contents: [
        {
          uri: uri.href,
          text: `Resource echo: ${message}`,
        },
      ],
    }
  }

  @Prompt('echo', {
    title: 'Echo Prompt',
    description: 'Creates a prompt to process a message',
    argsSchema: { message: z.string() },
  })
  async echoPrompt({ message }: { message: string }) {
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
    }
  }
}
