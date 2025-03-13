import "reflect-metadata";


export const CAPACITOR_JAVASCRIPT_INTERFACE = "capacitor:javascript:interface";

export const JavascriptInterface = (): MethodDecorator => {
  return <T>(target: Object, propertyKey: string | Symbol, descriptor?: TypedPropertyDescriptor<T>) => {
    Reflect.defineMetadata(CAPACITOR_JAVASCRIPT_INTERFACE, true, descriptor?.value);
    return descriptor;
  }
}