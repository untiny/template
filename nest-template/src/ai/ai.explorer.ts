import { Injectable } from '@nestjs/common'
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'
import { AI_TOOL_METADATA_KEY } from './ai.constants'
import { AiService } from './ai.service'
import { AiContextCreator } from './ai-context.creator'
import { ToolMetadata } from './decorators'

@Injectable()
export class AiExplorer {
  constructor(
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly aiService: AiService,
    private readonly contextCreator: AiContextCreator,
  ) {}

  explore() {
    const wrappers = this.discoveryService.getProviders()

    for (const wrapper of wrappers) {
      const { instance } = wrapper
      if (!instance) {
        continue
      }
      const prototype = Object.getPrototypeOf(instance)
      const methodNames = this.metadataScanner.getAllMethodNames(prototype)
      for (const methodName of methodNames) {
        const metadata = this.reflector.get<ToolMetadata>(AI_TOOL_METADATA_KEY, instance[methodName])
        if (!metadata) {
          continue
        }
        const handler = this.contextCreator.bind(wrapper, methodName)
        this.aiService.registerTool(metadata.name, {
          metadata,
          handler,
        })
      }
    }
  }
}
