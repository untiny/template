import { Injectable } from '@nestjs/common'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { AI_PARAMS_METADATA_KEY } from './ai.constants'
import { AiContext } from './ai.context'
import { ContextCallback } from './ai.interfaces'
import { ParamMetadata } from './decorators/create-param-metadata.decorator'

@Injectable()
export class AiContextCreator {
  bind(wrapper: InstanceWrapper, methodName: string): ContextCallback {
    const instance = wrapper.instance

    return async (context: AiContext) => {
      const method = instance[methodName] as Function

      const params: ParamMetadata[] = Reflect.getMetadata(AI_PARAMS_METADATA_KEY, method) ?? []
      if (!params) {
        return method.apply(instance, context)
      }
      const paramValues = params.map((param) => param.factory(param.key ?? null, context))
      return method.apply(instance, paramValues)
    }
  }
}
