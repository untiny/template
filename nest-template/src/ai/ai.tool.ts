import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import z from 'zod'
import { Param, Tool } from './decorators'

@Injectable()
export class AiTool {
  constructor(private readonly prisma: PrismaService) {}

  @Tool({
    name: 'search-tool',
    description: '搜索互联网, 并返回搜索结果',
    inputSchema: z.object({
      query: z.string().describe('搜索查询'),
    }),
    outputSchema: z.object({
      query: z.string().describe('搜索关键词'),
    }),
  })
  async searchTool(@Param() params: any) {
    console.log(params)

    // await this.prisma.user.findFirst()

    return params
  }
}
