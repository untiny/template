import Bridge from "./Bridge"
import { webview } from "@kit.ArkWeb"
import PluginCall from "./PluginCall";
import PluginResult from "./PluginResult";
import JSObject from "./JSObject";
import PluginManager from "./PluginManager";


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
  public postMessage(json: Record<string, Object>): void {
    try {
      let postData = JSObject.fromJSONObject(json);
      let type = postData.getString("type");

      let typeIsNotNull = type !== null;
      let isCordovaPlugin = typeIsNotNull && type === "cordova";
      let isJavaScriptError = typeIsNotNull && type === "js.error";

      let callbackId = postData.getString("callbackId") as string;

      if (isCordovaPlugin) {
        let service = postData.getString("service") as string;
        let action = postData.getString("action") as string;
        let actionArgs = postData.getString("actionArgs") as string;

        console.log(
          "Plugin",
          "To native (Cordova plugin): callbackId: " +
            callbackId +
            ", service: " +
            service +
            ", action: " +
            action +
            ", actionArgs: " +
            actionArgs
        );

        this.callCordovaPluginMethod(callbackId, service, action, actionArgs);
      } else if (isJavaScriptError) {
        console.error("JavaScript Error: " + JSON.stringify(postData))
      } else {
        let pluginId = postData.getString("pluginId") as string;
        let methodName = postData.getString("methodName") as string;
        let methodData = postData.getJSObject("options", new JSObject());

        console.info(
          "Plugin",
          "To native (Capacitor plugin): callbackId: " +
            callbackId +
            ", pluginId: " +
            pluginId +
            ", methodName: " +
            methodName
        );

        this.callPluginMethod(callbackId, pluginId, methodName, methodData as JSObject);
      }
    } catch (error) {
      console.error("Post message error:", error);
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
        console.debug("Sending plugin error: " + JSON.stringify(data));
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
      console.error("sendResponseMessage: error: " + error);
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
    console.info("Web set message callback");
    this.callback = callback;
  }

  private callPluginMethod(callbackId: string, pluginId: string, methodName: string, methodData: JSObject): void {
    let call = new PluginCall(this, pluginId, callbackId, methodName, methodData)
    this.bridge.callPluginMethod(pluginId, methodName, call);
  }

  private callCordovaPluginMethod(callbackId: string, service: string, action: string, actionArgs: string): void {
    throw new Error("MessageHandler callCordovaPluginMethod not implemented.")
  }
}