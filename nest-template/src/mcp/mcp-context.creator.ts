import { Injectable } from '@nestjs/common'
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import { ContextId, ContextIdFactory, ExternalContextCreator, ModuleRef } from '@nestjs/core'
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants'
import { Injector } from '@nestjs/core/injector/injector'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { Module } from '@nestjs/core/injector/module'
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants'
import { McpParamsFactory } from './mcp-params.factory'

@Injectable()
export class McpContextCreator {
  private readonly injector = new Injector()

  constructor(
    private readonly externalContextCreator: ExternalContextCreator,
    private readonly paramsFactory: McpParamsFactory,
    private readonly moduleRef: ModuleRef,
  ) {}

  public bind(wrapper: InstanceWrapper, methodName: string) {
    const instance = wrapper.instance

    if (wrapper.isDependencyTreeStatic() && !wrapper.isTransient) {
      return this.createContextCallback(instance, methodName)
    }

    return async (...args: any[]) => {
      const request = args[0]
      const contextId = ContextIdFactory.getByRequest(request)

      if (this.moduleRef.registerRequestByContextId && !contextId[REQUEST_CONTEXT_ID]) {
        this.moduleRef.registerRequestByContextId(request, contextId)
      }

      const moduleRef = wrapper.host as Module

      const contextInstance = await this.injector.loadPerContext(instance, moduleRef, moduleRef.providers, contextId)

      const contextCallback = this.createContextCallback(contextInstance, methodName, contextId, wrapper.id)
      return contextCallback?.(...args)
    }
  }

  private createContextCallback(
    instance: object,
    methodName: string,
    contextId: ContextId = STATIC_CONTEXT,
    wrapperId?: string,
  ) {
    if (!instance || typeof instance[methodName] !== 'function') {
      return
    }

    const prototype = Object.getPrototypeOf(instance)

    if (!prototype || !prototype[methodName]) {
      return
    }

    return this.externalContextCreator.create(
      instance,
      prototype[methodName],
      methodName,
      ROUTE_ARGS_METADATA,
      this.paramsFactory,
      contextId,
      wrapperId,
      { guards: true, filters: true, interceptors: true },
      'http',
    )
  }
}
