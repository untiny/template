import { randomUUID } from 'node:crypto'
import {
  McpServer,
  PromptCallback,
  ReadResourceCallback,
  ReadResourceTemplateCallback,
  ToolCallback,
} from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import { isInitializeRequest, ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js'
import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common'
import { DiscoveryService, HttpAdapterHost, MetadataScanner, Reflector } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { FastifyReply, FastifyRequest } from 'fastify'
import { MCP_PROMPT_METADATA_KEY, MCP_RESOURCE_METADATA_KEY, MCP_TOOL_METADATA_KEY } from './decorators/constants'
import { PromptMetadata } from './decorators/prompt.decorator'
import { ResourceOptions } from './decorators/resource.decorator'
import { ToolMetadata } from './decorators/tool.decorator'

@Injectable()
export class McpService implements OnModuleInit, OnApplicationBootstrap {
  private readonly logger = new Logger(McpService.name)
  private readonly transports: Map<string, StreamableHTTPServerTransport> = new Map()
  private readonly tools: Map<
    string,
    {
      handler: (...args: any[]) => any
      metadata: ToolMetadata
    }
  > = new Map()
  private readonly prompts: Map<
    string,
    {
      handler: (...args: any[]) => any
      metadata: PromptMetadata
    }
  > = new Map()
  private readonly resources: Map<
    string,
    {
      handler: (...args: any[]) => any
      metadata: ResourceOptions
    }
  > = new Map()

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  onModuleInit() {
    const app = this.httpAdapterHost.httpAdapter

    // app.post('/mcp', async (request, response) => {
    //   await this.handleRequest(request, response)
    // })

    // app.get('/mcp', async (request, response) => {
    //   await this.handleSessionRequest(request, response)
    // })

    // app.delete('/mcp', async (request, response) => {
    //   await this.handleSessionRequest(request, response)
    // })
  }

  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders()
    for (const provider of providers) {
      this.registerHandler(provider)
    }
    const controllers = this.discoveryService.getControllers()
    for (const controller of controllers) {
      this.registerHandler(controller)
    }
  }

  registerHandler(wrapper: InstanceWrapper) {
    const methods = this.metadataScanner.getAllMethodNames(wrapper.instance)
    for (const methodName of methods) {
      const method = wrapper.instance[methodName] as Function
      const handler = method.bind(wrapper.instance)

      const toolMetadata = this.reflector.get<ToolMetadata>(MCP_TOOL_METADATA_KEY, method)
      const resourceMetadata = this.reflector.get<ResourceOptions>(MCP_RESOURCE_METADATA_KEY, method)
      const promptMetadata = this.reflector.get<PromptMetadata>(MCP_PROMPT_METADATA_KEY, method)

      if (toolMetadata) {
        if (this.tools.has(toolMetadata.name)) {
          this.logger.warn(`Tool ${toolMetadata.name} already registered`)
        } else {
          this.tools.set(toolMetadata.name, { handler, metadata: toolMetadata })
        }
      } else if (resourceMetadata) {
        if (this.resources.has(resourceMetadata.name)) {
          this.logger.warn(`Resource ${resourceMetadata.name} already registered`)
        } else {
          this.resources.set(resourceMetadata.name, { handler, metadata: resourceMetadata })
        }
      } else if (promptMetadata) {
        if (this.prompts.has(promptMetadata.name)) {
          this.logger.warn(`Prompt ${promptMetadata.name} already registered`)
        } else {
          this.prompts.set(promptMetadata.name, { handler, metadata: promptMetadata })
        }
      }
    }
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
          console.log('Tool args:', ...args)
          let extra: RequestHandlerExtra<ServerRequest, ServerNotification>
          let input: Record<string, any>
          if (args.length === 2) {
            input = args[0]
            extra = args[1]
          } else {
            extra = args[0]
          }

          return handler(...args)
        })
        this.logger.verbose(`Tool ${metadata.name} registered`)
      })

      this.resources.forEach(({ handler, metadata }) => {
        if (typeof metadata.uriOrTemplate === 'string') {
          server.registerResource(metadata.name, metadata.uriOrTemplate, metadata, handler as ReadResourceCallback)
        } else {
          server.registerResource(
            metadata.name,
            metadata.uriOrTemplate,
            metadata,
            handler as ReadResourceTemplateCallback,
          )
        }
        this.logger.verbose(`Resource ${metadata.name} registered`)
      })

      this.prompts.forEach(({ handler, metadata }) => {
        server.registerPrompt(metadata.name, metadata, handler as PromptCallback)
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
