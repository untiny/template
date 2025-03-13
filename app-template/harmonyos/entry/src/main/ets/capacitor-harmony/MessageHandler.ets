import { Bridge } from './Bridge';
import { JavascriptInterface } from './decorators/JavascriptInterface';
import Logger from './Logger';
import PluginCall from './PluginCall';
import PluginErrorResult from './PluginErrorResult';
import { Any } from './Type';

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

export interface PluginResult {
  callbackId?: string;
  methodName?: string;
  data: Any;
  success: boolean;
  error?: PluginErrorResult;
  pluginId?: string;
  save?: boolean;
}

export class ResponseMessage implements PluginResult {
  callbackId?: string;
  methodName?: string;
  data: Any = null;
  success: boolean = true;
  error?: PluginErrorResult;
  pluginId?: string;
  save?: boolean;
}


export default class MessageHandler {
  private bridge: Bridge;
  private callback?: (event: ResponseMessage) => void;

  constructor(bridge: Bridge) {
    this.bridge = bridge
  }

  /**
   * 前端发送消息到鸿蒙
   * @param postData
   */
  @JavascriptInterface()
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
  @JavascriptInterface()
  public onmessage(callback: (event: ResponseMessage) => void) {
    this.callback = callback;
  }

  /**
   * 鸿蒙发送结果消息给前端
   */
  public sendResponseMessage(
    call: PluginCall,
    successResult: Any,
    errorResult?: PluginErrorResult
  ): void {
    try {
      let response = new ResponseMessage();
      response.save = call.isKeptAlive();
      response.callbackId = call.getCallbackId();
      response.pluginId = call.getPluginId();
      response.methodName = call.getMethodName();

      if (errorResult) {
        response.success = false;
        response.error = errorResult;
        Logger.debug("Sending plugin error: " + JSON.stringify(response));
      } else {
        response.success = true;
        response.data = successResult;
      }

      let isValidCallbackId = call.getCallbackId() !== PluginCall.CALLBACK_ID_DANGLING;
      if (isValidCallbackId) {
        if (this.callback != null) {
          this.callback(response);
        } else {
          this.legacySendResponseMessage(response);
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

  private legacySendResponseMessage(data: ResponseMessage) {
    let runScript = "window.Capacitor.fromNative(" + JSON.stringify(data) + ")";
    this.bridge.webviewController.runJavaScript(runScript);
  }

  private callPluginMethod(
    callbackId: string,
    pluginId: string,
    methodName: string,
    methodData: Record<string, Any>
  ): void {
    let call = new PluginCall(this, pluginId, callbackId, methodName, methodData)
    this.bridge.callPluginMethod(pluginId, methodName, call);
  }
}