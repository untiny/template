import "reflect-metadata";

export enum PluginMethodReturnType {
  PROMISE = "promise",
  CALLBACK = "callback",
  NONE = "none"
}

export interface PluginMethodMetadata {
  returnType: PluginMethodReturnType;
}

export const CAPACITOR_PLUGIN_METHOD = "capacitor:plugin:method";

export const PluginMethod = (metadata?: PluginMethodMetadata): MethodDecorator => {
  metadata = metadata ?? { returnType: PluginMethodReturnType.PROMISE };
  return <T>(target: Object, propertyKey: string | Symbol, descriptor?: TypedPropertyDescriptor<T>) => {
    Reflect.defineMetadata(CAPACITOR_PLUGIN_METHOD, metadata, descriptor?.value);
    return descriptor;
  }
}