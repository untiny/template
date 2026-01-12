import { AI_PARAMS_METADATA_KEY } from '../ai.constants'
import { ParamFactory } from '../ai.interfaces'

export interface ParamMetadata {
  index: number
  factory: ParamFactory
  key: string | null
}

export function createParamDecorator<TOutput = any>(factory: ParamFactory<TOutput>) {
  return (key?: string): ParameterDecorator => {
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
      const fn = target[propertyKey as string]
      const params: ParamMetadata[] = Reflect.getMetadata(AI_PARAMS_METADATA_KEY, fn) ?? []
      params.push({ index: parameterIndex, factory, key: key ?? null })
      Reflect.defineMetadata(AI_PARAMS_METADATA_KEY, params, fn)
    }
  }
}
