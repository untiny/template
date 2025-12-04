import { Injectable, Logger } from '@nestjs/common'
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { McpContextCreator } from './mcp-context.creator'

@Injectable()
export class McpExplorerService {
  private readonly wrappers: InstanceWrapper<any>[]
  private readonly logger = new Logger(McpExplorerService.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly contextCreator: McpContextCreator,
  ) {
    this.wrappers = [...this.discoveryService.getControllers(), ...this.discoveryService.getProviders()].filter(
      (wrapper) => {
        const { instance } = wrapper
        const prototype = instance ? Object.getPrototypeOf(instance) : null

        return instance && prototype
      },
    )
  }

  public explore<T extends Record<string, any>>(metadataKey: string) {
    const handlerMap = new Map<
      string,
      {
        handler: (...args: any[]) => any
        metadata: T
      }
    >()

    for (const wrapper of this.wrappers) {
      const { instance } = wrapper
      const prototype = Object.getPrototypeOf(instance)
      const methodNames = this.metadataScanner.getAllMethodNames(prototype)
      for (const methodName of methodNames) {
        const metadata = this.reflector.get<T>(metadataKey, instance[methodName])
        if (!metadata) {
          continue
        }
        const handler = this.contextCreator.bind(wrapper, methodName)
        if (!handler) {
          continue
        }
        if (handlerMap.has(metadata.name)) {
          this.logger.warn(`${metadataKey} ${metadata.name} already registered`)
        } else {
          handlerMap.set(metadata.name, { handler, metadata })
        }
      }
    }

    return handlerMap
  }
}
