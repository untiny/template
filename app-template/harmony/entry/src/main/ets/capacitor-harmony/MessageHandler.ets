import Bridge from "./Bridge"
import { webview } from "@kit.ArkWeb"
import PluginCall from "./PluginCall";
import PluginResult from "./PluginResult";
import JSObject from "./JSObject";


export default class MessageHandler {
  private bridge: Bridge;
  private webview: webview.WebviewController;
  private callback?: (event: Object) => void;

  constructor(bridge: Bridge, webview: webview.WebviewController) {
    this.bridge = bridge;
    this.webview = webview;
    this.webview.registerJavaScriptProxy(
      this,
      "harmonyBridge",
      ["postMessage", "onmessage"]
    );
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
      // if (isValidCallbackId) {
      //   if (this.bridge.getConfig().isUsingLegacyBridge()) {
      //   } else if (
      //     WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER) &&
      //       this.callback != null
      //   ) {
      //     this.callback(data);
      //   } else {
      //     this.legacySendResponseMessage(data);
      //   }
      // } else {
      //   this.bridge.getApp().fireRestoredResult(data);
      // }
    } catch (error) {
      console.error("sendResponseMessage: error: " + error);
    }
    if (!call.isKeptAlive()) {
      call.release(this.bridge);
    }
  }

  private legacySendResponseMessage(data: Object) {
    let runScript = "window.Capacitor.fromNative(" + JSON.stringify(data) + ")";
    this.webview.runJavaScript(runScript);
  }

  /** web侧设置回调 */
  public onmessage(callback: (event: Object) => void): void {
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