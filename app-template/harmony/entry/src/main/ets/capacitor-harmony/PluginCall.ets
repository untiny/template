import Bridge from "./Bridge";
import JSObject from "./JSObject";
import MessageHandler from "./MessageHandler";
import PluginErrorResult from "./PluginErrorResult";
import PluginResult from "./PluginResult";

export default class PluginCall {
  public static CALLBACK_ID_DANGLING: string = "-1";
  private msgHandler: MessageHandler;
  private pluginId: string;
  private callbackId: string;
  private methodName: string;
  private data: JSObject
  private keepAlive: boolean = false;

  constructor(msgHandler: MessageHandler, pluginId: string, callbackId: string, methodName: string, data: JSObject) {
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

  public resolve(data: Object | null = null) {
    this.msgHandler.sendResponseMessage(this, data, null);
  }

  public errorCallback(message: string) {
    let errorResult = new PluginErrorResult();
    errorResult.message = message;
    this.msgHandler.sendResponseMessage(this, null, errorResult);
  }

  public reject(message: string, code: string | null, error: Error | null = null, data: Object | null = null): void {
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
    return this.data.getString(name, defaultValue)
  }

  public getNumber(name: string, defaultValue: number | null = null): number | null {
    return this.data.getNumber(name, defaultValue)
  }

  public getBoolean(name: string, defaultValue: boolean = false): boolean {
    return this.data.getBoolean(name, defaultValue)
  }

  public getObject(name: string, defaultValue: JSObject | null = null): JSObject | null {
    return this.data.getJSObject(name, defaultValue)
  }

  public getArray(name: string, defaultValue: Array<Object> = []): Array<Object> {
    return this.data.getArray(name, defaultValue)
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