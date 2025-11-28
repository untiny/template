import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { McpService } from './mcp.service'

@Controller('mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Post()
  async handleRequest(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.mcpService.handleRequest(req, res)
  }

  @Get()
  async handleSessionRequest(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.mcpService.handleSessionRequest(req, res)
  }

  @Delete()
  async closeSession(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.mcpService.handleSessionRequest(req, res)
  }
}
