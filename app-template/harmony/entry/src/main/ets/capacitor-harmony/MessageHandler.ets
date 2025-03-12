import Bridge from './Bridge';
import { webview } from '@kit.ArkWeb';
import PluginCall from './PluginCall';
import PluginResult from './PluginResult';
import Logger from './Logger';

export interface MessageCallData {
  type?: 'message';
  callbackId: string;
  pluginId: string;
  methodName: string;
  options: Record<string, Object | null>;
}

interface GeneratedTypeLiteralInterface_1 {
  message: string;
  url: string;
  line: number;
  col: number;
  errorObject: string;
}

export interface ErrorCallData {
  type: 'js.error';
  error: GeneratedTypeLiteralInterface_1;
}

export type CallData = MessageCallData | ErrorCallData;


export default class MessageHandler {
  private bridge: Bridge;
  private webviewController: webview.WebviewController;
  private callback?: (event: Record<string, Object | null>) => void;

  constructor(bridge: Bridge, webviewController: webview.WebviewController) {
    this.bridge = bridge;
    this.webviewController = webviewController;
  }

  public getJavaScriptProxy(): JavaScriptProxy {
    return {
      object: this,
      name: "harmonyBridge",
      methodList: ["postMessage", "onmessage"],
      controller: this.webviewController
    }
  }

  /** web侧发送消息到鸿蒙 */
  public postMessage(postData: CallData): void {
    try {
      let typeIsNotNull = postData.type !== null;
      let isJavaScriptError = typeIsNotNull && postData.type === "js.error";
      if (isJavaScriptError) {
        Logger.error("JavaScript Error: " + JSON.stringify(postData))
      } else {
        let call = postData as MessageCallData;
        let callbackId = call.callbackId;
        let pluginId = call.pluginId;
        let methodName = call.methodName;
        let methodData = call.options;

        Logger.info(
          "Plugin",
          "To native (Capacitor plugin): callbackId: " +
            callbackId +
            ", pluginId: " +
            pluginId +
            ", methodName: " +
            methodName
        );

        this.callPluginMethod(callbackId, pluginId, methodName, methodData);
      }
    } catch (error) {
      Logger.error("Post message error:", error);
    }
  }

  public sendResponseMessage(
    call: PluginCall,
    successResult: Object | null,
    errorResult: Object | null
  ): void {
    try {
      let data = new PluginResult();
      data.put("save", call.isKeptAlive());
      data.put("callbackId", call.getCallbackId());
      data.put("pluginId", call.getPluginId());
      data.put("methodName", call.getMethodName());

      let pluginResultInError: boolean = errorResult !== null;
      if (pluginResultInError) {
        data.put("success", false);
        data.put("error", errorResult);
        Logger.debug("Sending plugin error: " + JSON.stringify(data));
      } else {
        data.put("success", true);
        if (successResult !== null) {
          data.put("data", successResult);
        }
      }

      let isValidCallbackId = call.getCallbackId() !== PluginCall.CALLBACK_ID_DANGLING;
      if (isValidCallbackId) {
        if (this.callback != null) {
          this.callback(data.toObject());
        } else {
          this.legacySendResponseMessage(data.toObject());
        }
      } else {
        this.bridge.getApp().fireRestoredResult(data);
      }
    } catch (error) {
      Logger.error("sendResponseMessage: error: " + error);
    }
    if (!call.isKeptAlive()) {
      call.release(this.bridge);
    }
  }

  private legacySendResponseMessage(data: Record<string, Object | null>) {
    let runScript = "window.Capacitor.fromNative(" + JSON.stringify(data) + ")";
    this.webviewController.runJavaScript(runScript);
  }

  /** web侧设置回调 */
  public onmessage(callback: (event: Record<string, Object | null>) => void): void {
    Logger.info("Web set message callback");
    this.callback = callback;
  }

  private callPluginMethod(callbackId: string, pluginId: string, methodName: string,
    methodData: Record<string, Object | null>): void {
    let call = new PluginCall(this, pluginId, callbackId, methodName, methodData)
    this.bridge.callPluginMethod(pluginId, methodName, call);
  }

  private callCordovaPluginMethod(callbackId: string, service: string, action: string, actionArgs: string): void {
    throw new Error("MessageHandler callCordovaPluginMethod not implemented.")
  }
}