import Bridge from "./Bridge";
import JSObject from "./JSObject";
import MessageHandler from "./MessageHandler";
import PluginErrorResult from "./PluginErrorResult";
import PluginResult from "./PluginResult";
import { Any } from "./Type";

export default class PluginCall {
  public static CALLBACK_ID_DANGLING: string = "-1";
  private msgHandler: MessageHandler;
  private pluginId: string;
  private callbackId: string;
  private methodName: string;
  private data: Record<string, Any>
  private keepAlive: boolean = false;

  constructor(msgHandler: MessageHandler, pluginId: string, callbackId: string, methodName: string,
    data: Record<string, Any>) {
    this.msgHandler = msgHandler;
    this.pluginId = pluginId;
    this.callbackId = callbackId;
    this.methodName = methodName;
    this.data = data;
  }

  public successCallback(successResult: PluginResult) {
    if (PluginCall.CALLBACK_ID_DANGLING === this.callbackId) {
      return;
    }

    this.msgHandler.sendResponseMessage(this, successResult, null);
  }

  public resolve(data: Object): void

  public resolve(): void

  public resolve(data: Any = null) {
    this.msgHandler.sendResponseMessage(this, data, null);
  }

  public errorCallback(message: string) {
    let errorResult = new PluginErrorResult();
    errorResult.message = message;
    this.msgHandler.sendResponseMessage(this, null, errorResult);
  }

  public reject(message: string, code: string | null, error: Error | null = null, data: Any = null): void {
    let errorResult = new PluginErrorResult();
    if (error !== null) {
      console.error("Plugin", message, error);
    }
    errorResult.message = message;
    errorResult.code = code;
    if (data !== null) {
      errorResult.data = data
    }
    this.msgHandler.sendResponseMessage(this, null, errorResult);
  }

  public unimplemented(message: string = "not implemented") {
    this.reject(message, "UNIMPLEMENTED");
  }

  public unavailable(message: string = "not available") {
    this.reject(message, "UNAVAILABLE");
  }

  public getPluginId() {
    return this.pluginId;
  }

  public getCallbackId() {
    return this.callbackId;
  }

  public getMethodName() {
    return this.methodName;
  }

  public getData() {
    return this.data;
  }

  public getString(name: string, defaultValue: string | null = null): string | null {
    return Reflect.get(this.data, name) as string ?? defaultValue;
  }

  public getNumber(name: string, defaultValue: number | null = null): number | null {
    return Reflect.get(this.data, name) as number ?? defaultValue;
  }

  public getBoolean(name: string, defaultValue: boolean = false): boolean {
    return Reflect.get(this.data, name) as boolean ?? defaultValue;
  }

  public getObject(name: string, defaultValue: Record<string, Any> | null = null): Record<string, Any> | null {
    return Reflect.get(this.data, name) as Record<string, Any> ?? defaultValue;
  }

  public getArray(name: string, defaultValue: Array<Object> = []): Array<Object> {
    return Reflect.get(this.data, name) as Array<Object> ?? defaultValue;
  }

  public setKeepAlive(keepAlive: boolean) {
    this.keepAlive = keepAlive;
  }

  public release(bridge: Bridge) {
    this.keepAlive = false;
    bridge.releaseCall(this);
  }

  public isKeptAlive() {
    return this.keepAlive;
  }
}