import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { MCP_PROMPT_METADATA_KEY, MCP_RESOURCE_METADATA_KEY, MCP_TOOL_METADATA_KEY } from './decorators/constants'
import { McpController } from './mcp.controller'
import { McpService } from './mcp.service'
import { McpTool } from './mcp.tool'
import { McpContextCreator } from './mcp-context.creator'
import { McpExplorerService } from './mcp-explorer.service'
import { McpParamsFactory } from './mcp-params.factory'

@Module({
  imports: [DiscoveryModule],
  providers: [McpService, McpTool, McpParamsFactory, McpContextCreator, McpExplorerService],
  controllers: [McpController],
})
export class McpModule {}
