import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { McpController } from './mcp.controller'
import { McpService } from './mcp.service'
import { McpTool } from './mcp.tool'

@Module({
  imports: [DiscoveryModule],
  providers: [McpService, McpTool],
  controllers: [McpController],
})
export class McpModule {}
