import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { convertToModelMessages, Experimental_Agent, generateText, stepCountIs, streamText, tool } from 'ai'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { AiContext } from './ai.context'
import { AiService } from './ai.service'
import { qwen, qwen3Max, qwen3VlPlus } from './models'

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async root(@Req() request: FastifyRequest, @Res() response: FastifyReply, @Body() body: any) {
    console.log(body)

    const { text } = await generateText({
      model: qwen('qwen-plus'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    })

    console.log(text)

    const context = AiContext.create({ id: 'xxx' }, request.id)

    const agent = new Experimental_Agent({
      model: qwen3Max,
      system: `
      你是一个名为小棉的智能助手，你可以回答用户的问题。
      但不能回答编程类问题，如：代码、编程、开发等。
      `,
      tools: this.aiService.generateTools(context),

      // tools: {
      //   searchTool: tool({
      //     name: 'search-tool',
      //     description: '搜索互联网, 并返回搜索结果',
      //     inputSchema: z.object({
      //       query: z.string().describe('搜索查询'),
      //     }),
      //     outputSchema: z.object({
      //       query: z.string().describe('搜索关键词'),
      //     }),
      //     execute: async ({ query }) => {
      //       console.log('searchTool', { query })

      //       return {
      //         query,
      //       }
      //     },
      //   }),
      //   // 生产制单识别结果
      //   productionOrderTool: tool({
      //     description: '生产制单图片识别结果',
      //     inputSchema: z.object({
      //       order_no: z.string().describe('订单编号').optional(),
      //       style_no: z.string().describe('款式编号').optional(),
      //       style_name: z.string().describe('款式名称').optional(),
      //       order_time: z.string().describe('订单时间').optional(),
      //       colors: z.array(z.string()).describe('颜色列表').optional(),
      //       sizes: z.array(z.string()).describe('尺寸列表').optional(),
      //       quantities: z
      //         .array(
      //           z
      //             .object({
      //               color: z.string().describe('颜色'),
      //               size: z.string().describe('尺寸'),
      //               quantity: z.number().describe('数量'),
      //             })
      //             .describe('颜色尺码数量'),
      //         )
      //         .describe('订单数量')
      //         .optional(),
      //     }),
      //     outputSchema: z.array(
      //       z.object({
      //         key: z.string().describe('键'),
      //         value: z.any().describe('值'),
      //         label: z.string().describe('标签名'),
      //         label_value: z.string().describe('标签值'),
      //       }),
      //     ),
      //     execute: async (params) => {
      //       console.log('productionOrderTool', { params })

      //       return Object.entries(params).map(([key, value]) => ({
      //         key,
      //         value,
      //         label: key,
      //         label_value: String(value),
      //       }))
      //     },
      //   }),
      // },
      stopWhen: stepCountIs(5),
    })

    const stream = agent.stream({
      messages: convertToModelMessages(body.messages),
    })

    response.send(stream.toUIMessageStreamResponse())

    const totalUsage = await stream.totalUsage

    console.log(totalUsage)
  }

  @Post('productionOrderTool')
  async productionOrderTool(@Res() response: FastifyReply, @Body() body: any) {
    console.log(body)
    const stream = streamText({
      model: qwen3VlPlus,
      system: `你是一个智能助手，你可以回答用户的问题。`,
      tools: {
        // 生产制单识别结果
        productionOrderTool: tool({
          description: '生产制单图片识别结果',
          inputSchema: z.object({
            order_no: z.string().describe('订单编号').optional(),
            style_no: z.string().describe('款式编号').optional(),
            style_name: z.string().describe('款式名称').optional(),
            order_time: z.string().describe('订单时间').optional(),
            colors: z.array(z.string()).describe('颜色列表').optional(),
            sizes: z.array(z.string()).describe('尺寸列表').optional(),
            quantities: z
              .array(
                z
                  .object({
                    color: z.string().describe('颜色'),
                    size: z.string().describe('尺寸'),
                    quantity: z.number().describe('数量'),
                  })
                  .describe('颜色尺码数量'),
              )
              .describe('订单数量')
              .optional(),
          }),
          outputSchema: z.array(
            z.object({
              key: z.string().describe('键'),
              value: z.any().describe('值'),
              label: z.string().describe('标签名'),
              label_value: z.string().describe('标签值'),
            }),
          ),
          execute: async (params) => {
            console.log('productionOrderTool', { params })

            return Object.entries(params).map(([key, value]) => ({
              key,
              value,
              label: key,
              label_value: String(value),
            }))
          },
        }),
      },
      messages: convertToModelMessages(body.messages),
      toolChoice: {
        type: 'tool',
        toolName: 'productionOrderTool',
      },
    })

    response.send(stream.toUIMessageStreamResponse())

    const totalUsage = await stream.totalUsage

    console.log(totalUsage)
  }
}
