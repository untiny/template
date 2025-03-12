import { Bridge } from './Bridge';
import Logger from './Logger';
import PluginCall from './PluginCall';
import PluginResult from './PluginResult';

export interface MessageCallData {
  type?: 'message';
  callbackId: string;
  pluginId: string;
  methodName: string;
  options: Record<string, Object | null>;
}

interface JsErrorData {
  message: string;
  url: string;
  line: number;
  col: number;
  errorObject: string;
}

export interface ErrorCallData {
  type: 'js.error';
  error: JsErrorData;
}

export type CallData = MessageCallData | ErrorCallData;

export default class MessageHandler {
  private bridge: Bridge;
  private callback?: (event: Record<string, Object | null>) => void;

  constructor(bridge: Bridge) {
    this.bridge = bridge
  }

  /**
   * 前端发送消息到鸿蒙
   * @param postData
   */
  public postMessage(postData: CallData): void {
    Logger.debug("MessageHandler", "Harmony receive web message: " + JSON.stringify(postData));
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

  /**
   * 前端设置消息回调，鸿蒙通过回调函数将消息返回给前端
   * @param callback
   */
  public onmessage(callback: (event: Record<string, Object | null>) => void) {
    this.callback = callback;
  }

  /**
   * 鸿蒙发送结果消息给前端
   */
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
        // this.bridge.getApp().fireRestoredResult(data);
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
    this.bridge.webviewController.runJavaScript(runScript);
  }

  private callPluginMethod(callbackId: string, pluginId: string, methodName: string,
    methodData: Record<string, Object | null>): void {
    let call = new PluginCall(this, pluginId, callbackId, methodName, methodData)
    this.bridge.callPluginMethod(pluginId, methodName, call);
  }
}