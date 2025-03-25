import { webview } from '@kit.ArkWeb';
import JSExport from './JSExport';
import MessageHandler from './MessageHandler';
import PluginCall from './PluginCall';
import { HashMap, List } from '@kit.ArkTS';
import Plugin from './Plugin';
import PluginHandle from './PluginHandle';
import { TypeConstructor } from '@ohos.arkui.StateManagement';
import { CAPACITOR_PLUGIN, PluginMetadata } from './decorators/CapacitorPlugin';
import CapacitorHttp from './plugin/CapacitorHttp';
import Logger from './Logger';
import CapConfig from './CapConfig';
import { BusinessError } from '@kit.BasicServicesKit';
import App from './App';
import { AbilityConstant, Want } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';

export class Bridge {
  public static DEFAULT_WEB_ASSET_DIR = "public";
  public static CAPACITOR_HTTP_SCHEME = "http";
  public static CAPACITOR_HTTPS_SCHEME = "https";
  private context: Context = getContext();
  public webviewController = new webview.WebviewController();
  public messageHandler = new MessageHandler(this);
  private localUrl: string = "http://localhost/";
  private initialPlugins: List<TypeConstructor<Plugin>> = new List<TypeConstructor<Plugin>>();
  private pluginInstances: List<Plugin> = new List<Plugin>();
  private plugins: HashMap<string, PluginHandle> = new HashMap<string, PluginHandle>();
  private savedCalls: HashMap<string, PluginCall> = new HashMap<string, PluginCall>();
  private config?: CapConfig
  private app: App;
  private backPressedCallbacks = new List<() => void>();
  private windowStage?: window.WindowStage

  constructor() {
    // this.config = CapConfig.loadDefault(this.getContext());
    this.app = new App()
  }

  public start() {
    this.registerAllPlugins();
  }

  public setContext(context: Context) {
    this.context = context;
  }

  public getContext() {
    if (!this.context) {
      this.context = getContext()
    }
    return this.context;
  }

  public getConfig() {
    return this.config ?? CapConfig.loadDefault(this.getContext());
  }

  public getApp() {
    return this.app;
  }

  public getLocalUrl() {
    return this.localUrl
  }

  public setWindowStage(windowStage: window.WindowStage) {
    this.windowStage = windowStage;
  }

  public getWindowStage() {
    return this.windowStage;
  }

  public get javaScriptProxy(): JavaScriptProxy {
    return {
      object: this.messageHandler,
      name: "harmonyBridge",
      methodList: ["postMessage", "onmessage"],
      controller: this.webviewController
    }
  }

  public get injectorScripts(): ScriptItem[] {
    let scripts: string[] = [
      JSExport.getPlatformJS(),
      JSExport.getGlobalJS(this.getContext(), true, true), // 还需做成读取CapConfig
      JSExport.getBridgeJS(this.getContext()),
      JSExport.getPluginJS(this.plugins.values()),
      JSExport.getCordovaJS(this.getContext()),
      JSExport.getCordovaPluginJS(this.getContext()),
      JSExport.getCordovaPluginsFileJS(this.getContext()),
      "window.WEBVIEW_SERVER_URL = '" + this.localUrl + "';",
    ];
    return [{ script: scripts.join("\n\n"), scriptRules: ["*"] }];
  }

  private getMimeType(path: string): string {
    let mimeType: string = '';
    if (path.endsWith(".html")) {
      mimeType = "text/html";
    } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
      mimeType = "application/javascript";
    } else if (path.endsWith(".wasm")) {
      mimeType = "application/wasm";
    } else if (path.endsWith(".css")) {
      mimeType = "text/css";
    } else if (path.endsWith(".svg")) {
      mimeType = "image/svg+xml";
    } else if (path.endsWith(".png")) {
      mimeType = "image/png";
    } else if (path.endsWith(".webp")) {
      mimeType = "image/webp";
    } else if (path.endsWith(".jpg")) {
      mimeType = "image/jpeg";
    }
    return mimeType;
  }

  public onInterceptRequest = (event: OnInterceptRequestEvent): WebResourceResponse | null => {
    let url = event?.request.getRequestUrl();
    console.log('onInterceptRequest url: ' + url)

    if (url.startsWith(this.localUrl)) {
      let path = url.replace(this.localUrl, 'public/');
      if (path === 'public/') {
        path += 'index.html';
      }
      console.log("rawfile path:", path);
      let response = new WebResourceResponse();
      let mimeType = this.getMimeType(path);
      response.setResponseData($rawfile(path));
      response.setResponseMimeType(mimeType);
      response.setResponseEncoding('utf-8');
      response.setResponseCode(200);
      response.setReasonMessage('OK');
      response.setResponseIsReady(true);
      response.setResponseHeader([
        {
          headerKey: 'Access-Control-Allow-Origin', headerValue: '*'
        },
        {
          headerKey: 'Connection', headerValue: 'keep-alive'
        },
        {
          headerKey: 'Cache-Control', headerValue: 'no-cache'
        },
      ]);

      return response;
    }

    return null;
  }

  public addPlugin(plugin: TypeConstructor<Plugin>): void {
    this.initialPlugins.add(plugin);
  }

  public addPlugins(plugins: List<TypeConstructor<Plugin>>): void {
    plugins.forEach((plugin) => {
      this.addPlugin(plugin)
    });
  }

  // public addPluginInstance(plugin: Plugin): void {
  //   this.pluginInstances.add(plugin);
  // }
  //
  // public addPluginInstances(plugins: List<Plugin>): void {
  //   plugins.forEach((plugin) => {
  //     this.addPluginInstance(plugin);
  //   });
  // }


  public registerPlugin(plugin: TypeConstructor<Plugin>): void {
    let pluginId = this.pluginId(plugin);
    if (!pluginId) {
      return;
    }
    Logger.info("Register Plugin: " + pluginId);
    this.plugins.set(pluginId, new PluginHandle(plugin, this));
  }

  public registerPlugins(plugins: List<TypeConstructor<Plugin>>): void {
    plugins.forEach((plugin) => {
      this.registerPlugin(plugin)
    })
  }

  // public registerPluginInstance(plugin: Plugin): void {
  //   // ArkTS 没办法对实例获取原型
  // }

  // public registerPluginInstances(plugins: List<Plugin>): void {
  //   plugins.forEach((plugin) => {
  //     this.registerPluginInstance(plugin)
  //   })
  // }

  private registerAllPlugins(): void {
    this.registerPlugin(CapacitorHttp);

    this.initialPlugins.forEach((pluginClass) => {
      this.registerPlugin(pluginClass);
    });
  }


  private pluginId(plugin: TypeConstructor<Plugin>): string {
    let pluginMetadata: PluginMetadata = Reflect.getMetadata(CAPACITOR_PLUGIN, plugin);
    return pluginMetadata.name ?? plugin.name;
  }

  public saveCall(call: PluginCall) {
    this.savedCalls.set(call.getCallbackId(), call);
  }

  public getSavedCall(callbackId: string): PluginCall | null {
    if (callbackId == null) {
      return null;
    }
    return this.savedCalls.get(callbackId);
  }

  public releaseCall(call: PluginCall): void

  public releaseCall(callbackId: string): void

  public releaseCall(call: PluginCall | string) {
    let callbackId: string = call instanceof PluginCall ? call.getCallbackId() : call
    this.savedCalls.remove(callbackId);
  }

  public callPluginMethod(pluginId: string, methodName: string, call: PluginCall): void {
    try {
      let plugin = this.getPlugin(pluginId);
      if (!plugin) {
        Logger.error("unable to find plugin : " + pluginId);
        call.errorCallback("unable to find plugin : " + pluginId);
        return;
      }

      if (Logger.shouldLog()) {
        Logger.info(
          "callback: " +
          call.getCallbackId() +
            ", pluginId: " +
          plugin.getId() +
            ", methodName: " +
            methodName +
            ", methodData: " +
          call.getData().toString()
        );
      }

      (async () => {
        plugin.invoke(methodName, call);

        if (call.isKeptAlive()) {
          this.saveCall(call);
        }
      })().catch((error: BusinessError) => {
        Logger.debug("插件方法执行失败" + error.message + error.stack)
      })

    } catch (error) {
      Logger.error(Logger.tags("callPluginMethod"), "error: " + error?.message)
      call.errorCallback(error?.message);
    }

  }

  public getPlugin(pluginId: string) {
    return this.plugins.get(pluginId);
  }

  public onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    this.plugins.forEach((pluginHandle) => {
      pluginHandle?.getInstance()?.handleOnNewWant(want, launchParam);
    })
  }

  public onRestart() {
    this.plugins.forEach((pluginHandle) => {
      pluginHandle?.getInstance()?.handleOnRestart();
    })
  }

  public onStart() {
    this.plugins.forEach((pluginHandle) => {
      pluginHandle?.getInstance()?.handleOnStart();
    })
  }

  public onResume() {
    this.plugins.forEach((pluginHandle) => {
      pluginHandle?.getInstance()?.handleOnResume();
    })
  }

  public onPause() {
    this.plugins.forEach((pluginHandle) => {
      pluginHandle?.getInstance()?.handleOnPause();
    })
  }

  public onStop() {
    this.plugins.forEach((pluginHandle) => {
      pluginHandle?.getInstance()?.handleOnStop();
    })
  }

  public onDestroy() {
    this.plugins.forEach((pluginHandle) => {
      pluginHandle?.getInstance()?.handleOnDestroy();
    })
  }

  public onBackPressed() {
    this.backPressedCallbacks.forEach(callback => {
      callback()
    })
  }

  public addBackPressedCallback(callback: () => void) {
    this.backPressedCallbacks.add(callback)
  }

  public eval(js: string, callback?: () => void) {
    this.webviewController.runJavaScript(js)
  }

  public logToJs(message: string, level: string = 'log') {
    this.eval("window.Capacitor.logJs(\"" + message + "\", \"" + level + "\")");
  }

  public triggerJSEvent(eventName: string, target: string, data?: string) {
    if (data) {
      this.eval("window.Capacitor.triggerEvent(\"" + eventName + "\", \"" + target + "\", " + data + ")");
    } else {
      this.eval("window.Capacitor.triggerEvent(\"" + eventName + "\", \"" + target + "\")");
    }
  }

  public triggerWindowJSEvent(eventName: string, data?: string) {
    this.triggerJSEvent(eventName, "window", data);
  }

  public triggerDocumentJSEvent(eventName: string, data?: string) {
    this.triggerJSEvent(eventName, "document", data);
  }
}

export const bridge = new Bridge()

