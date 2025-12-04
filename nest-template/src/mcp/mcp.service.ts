import { randomUUID } from 'node:crypto'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import { isInitializeRequest, ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js'
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { set } from 'lodash'
import { MCP_PROMPT_METADATA_KEY, MCP_RESOURCE_METADATA_KEY, MCP_TOOL_METADATA_KEY } from './decorators/constants'
import { PromptMetadata } from './decorators/prompt.decorator'
import { ResourceOptions } from './decorators/resource.decorator'
import { ToolMetadata } from './decorators/tool.decorator'
import { McpExplorerService } from './mcp-explorer.service'

@Injectable()
export class McpService implements OnApplicationBootstrap {
  private readonly logger = new Logger(McpService.name)
  private readonly transports: Map<string, StreamableHTTPServerTransport> = new Map()
  private tools: Map<
    string,
    {
      handler: (...args: any[]) => any
      metadata: ToolMetadata
    }
  > = new Map()
  private prompts: Map<
    string,
    {
      handler: (...args: any[]) => any
      metadata: PromptMetadata
    }
  > = new Map()
  private resources: Map<
    string,
    {
      handler: (...args: any[]) => any
      metadata: ResourceOptions
    }
  > = new Map()

  constructor(private readonly explorer: McpExplorerService) {}

  onApplicationBootstrap() {
    this.tools = this.explorer.explore<ToolMetadata>(MCP_TOOL_METADATA_KEY)
    this.prompts = this.explorer.explore<PromptMetadata>(MCP_PROMPT_METADATA_KEY)
    this.resources = this.explorer.explore<ResourceOptions>(MCP_RESOURCE_METADATA_KEY)
  }

  async handleSessionRequest(request: FastifyRequest, response: FastifyReply) {
    const sessionId = request.headers['mcp-session-id'] as string | undefined

    if (!sessionId || !this.transports.has(sessionId)) {
      response.status(400).send('Invalid or missing session ID')
      return
    }

    const transport = this.transports.get(sessionId)

    await transport?.handleRequest(request.raw, response.raw)
  }

  async handleRequest(request: FastifyRequest, response: FastifyReply) {
    const sessionId = request.headers['mcp-session-id'] as string | undefined

    this.logger.log({
      message: `${sessionId ? `Session ${sessionId}` : 'No session ID'} handled`,
      path: request.url,
      method: request.method,
      headers: request.headers,
      payload: request.body,
    })

    let transport: StreamableHTTPServerTransport

    if (sessionId && this.transports.has(sessionId)) {
      transport = this.transports.get(sessionId) as StreamableHTTPServerTransport
    } else if (!sessionId && isInitializeRequest(request.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        enableJsonResponse: true,
        onsessioninitialized: (sessionId) => {
          this.transports.set(sessionId, transport)
        },
      })

      transport.onclose = () => {
        if (transport.sessionId) {
          this.transports.delete(transport.sessionId)
        }
      }
      const server = new McpServer({
        name: 'example-server',
        version: '1.0.0',
      })

      // ... set up server resources, tools, and prompts ...

      this.tools.forEach(({ handler, metadata }) => {
        server.registerTool(metadata.name, metadata, (...args: any[]) => {
          let extra: RequestHandlerExtra<ServerRequest, ServerNotification>
          let input: Record<string, any> = {}
          if (args.length === 2) {
            input = args[0]
            extra = args[1]
          } else {
            extra = args[0]
          }
          set(request, ['mcp', 'parameters'], input)
          set(request, ['mcp', 'extra'], extra)
          return handler(request, response)
        })
        this.logger.verbose(`Tool ${metadata.name} registered`)
      })

      this.resources.forEach(({ handler, metadata }) => {
        if (typeof metadata.uriOrTemplate === 'string') {
          server.registerResource(metadata.name, metadata.uriOrTemplate, metadata, (uri, extra) => {
            set(request, ['mcp', 'uri'], uri)
            set(request, ['mcp', 'extra'], extra)
            return handler(request, response)
          })
        } else {
          server.registerResource(metadata.name, metadata.uriOrTemplate, metadata, (uri, variables, extra) => {
            set(request, ['mcp', 'uri'], uri)
            set(request, ['mcp', 'parameters'], variables)
            set(request, ['mcp', 'extra'], extra)
            return handler(request, response)
          })
        }
        this.logger.verbose(`Resource ${metadata.name} registered`)
      })

      this.prompts.forEach(({ handler, metadata }) => {
        server.registerPrompt(metadata.name, metadata, (...args: any[]) => {
          let extra: RequestHandlerExtra<ServerRequest, ServerNotification>
          let parameters: Record<string, any> = {}
          if (args.length === 2) {
            parameters = args[0]
            extra = args[1]
          } else {
            extra = args[0]
          }
          set(request, ['mcp', 'parameters'], parameters)
          set(request, ['mcp', 'extra'], extra)
          return handler(request, response)
        })
        this.logger.verbose(`Prompt ${metadata.name} registered`)
      })

      // Connect to the MCP server
      await server.connect(transport)
    } else {
      // Invalid request
      response.status(400).send({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      })
      return
    }

    // Handle the request
    await transport.handleRequest(request.raw, response.raw, request.body)
  }
}
