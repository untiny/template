import { PluginMethodMetadata, PluginMethodReturnType } from "./decorators/PluginMethod"

export default class PluginMethodHandle {
  private method: Function;
  private name: string;
  private returnType: PluginMethodReturnType;

  constructor(method: Function, metadata: PluginMethodMetadata) {
    this.method = method;
    this.name = method.name;
    this.returnType = metadata.returnType ?? PluginMethodReturnType.PROMISE;
  }

  public getReturnType(): PluginMethodReturnType {
    return this.returnType;
  }

  public getName(): string {
    return this.name;
  }

  public getMethod(): Function {
    return this.method;
  }
}