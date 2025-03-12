import CapConfig from "./CapConfig";
import JSExport from "./JSExport";
import JSInjector from "./JSInjector";
import PluginCall from "./PluginCall";
import { HashMap, HashSet, LinkedList, List, uri } from "@kit.ArkTS";
import { webview } from "@kit.ArkWeb";
import App from "./App";
import MessageHandler from "./MessageHandler";
import Plugin from "./Plugin";
import PluginHandle from "./PluginHandle";
import ServerPath from "./ServerPath";
import PluginManager from "./PluginManager";
import { AbilityConstant, Want } from "@kit.AbilityKit";
import { TypeConstructor } from "@ohos.arkui.StateManagement";
import Logger from "./Logger";

export default class Bridge {
  private static PERMISSION_PREFS_NAME = "PluginPermStates";
  private static BUNDLE_LAST_PLUGIN_ID_KEY = "capacitorLastActivityPluginId";
  private static BUNDLE_LAST_PLUGIN_CALL_METHOD_NAME_KEY = "capacitorLastActivityPluginMethod";
  private static BUNDLE_PLUGIN_CALL_OPTIONS_SAVED_KEY = "capacitorLastPluginCallOptions";
  private static BUNDLE_PLUGIN_CALL_BUNDLE_KEY = "capacitorLastPluginCallBundle";
  private static LAST_BINARY_VERSION_CODE = "lastBinaryVersionCode";
  private static LAST_BINARY_VERSION_NAME = "lastBinaryVersionName";
  private static MINIMUM_ANDROID_WEBVIEW_ERROR = "System WebView is not supported";
  // The name of the directory we use to look for index.html and the rest of our web assets
  public static DEFAULT_WEB_ASSET_DIR = "public";
  public static CAPACITOR_HTTP_SCHEME = "http";
  public static CAPACITOR_HTTPS_SCHEME = "https";
  public static CAPACITOR_FILE_START = "/_capacitor_file_";
  public static CAPACITOR_CONTENT_START = "/_capacitor_content_";
  public static CAPACITOR_HTTP_INTERCEPTOR_START = "/_capacitor_http_interceptor_";
  public static CAPACITOR_HTTP_INTERCEPTOR_URL_PARAM = "u";
  private config: CapConfig;
  private context: Context;
  private localUrl: string = "http://192.168.10.170:5173";
  private appUrl?: string;
  private appUrlConfig?: string;
  private allowedOriginRules: HashSet<string> = new HashSet<string>();
  private authorities: string[] = [];
  public webviewController: webview.WebviewController;
  private app: App;
  public msgHandler: MessageHandler;
  private initialPlugins: List<TypeConstructor<Plugin>>;
  private pluginInstances: List<Plugin>;
  private plugins: HashMap<string, PluginHandle> = new HashMap<string, PluginHandle>();
  private savedCalls: HashMap<string, PluginCall> = new HashMap<string, PluginCall>();
  private savedPermissionCallIds: HashMap<string, LinkedList<string>> = new HashMap<string, LinkedList<string>>();
  private pluginCallForLastActivity: PluginCall | null = null;

  // private intentUri: uri.URI;
  // private serverPath: ServerPath;
  // private fragment: null;
  // private cordovaInterface: null;
  // private preferences: null;

  constructor(
    context: Context,
    // serverPath: ServerPath,
    // fragment: null,
    webviewController: webview.WebviewController,
    initialPlugins: List<TypeConstructor<Plugin>>,
    pluginInstances: List<Plugin>,
    // cordovaInterface: null,
    // pluginManager: PluginManager,
    // preferences: null,
    config?: CapConfig
  ) {
    this.app = new App();
    // this.serverPath = serverPath;
    this.context = context;
    // this.fragment = fragment;
    this.webviewController = webviewController;
    // this.webviewControllerClient = new BridgeWebViewClient(this);
    this.initialPlugins = initialPlugins;
    this.pluginInstances = pluginInstances;
    // this.cordovaInterface = cordovaInterface;
    // this.preferences = preferences;
    this.config = config ?? CapConfig.loadDefault(context);
    Logger.init(this.config);

    this.initWebView();
    this.setAllowedOriginRules();

    this.msgHandler = new MessageHandler(this, this.webviewController);

    this.registerAllPlugins();
    this.loadWebView();
  }

  public getWebviewController() {
    return this.webviewController;
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

  public getJavaScriptProxy() {
    return this.msgHandler.getJavaScriptProxy();
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

  public getApp() {
    return this.app;
  }

  public getContext() {
    return this.context;
  }

  public getLocalUrl() {
    return this.localUrl;
  }

  private loadWebView() {

  }

  private initWebView() {
  }

  private setAllowedOriginRules() {
  }

  private registerAllPlugins() {
  }

  public getJSInjector(context?: Context): JSInjector {
    let platformJS = JSExport.getPlatformJS();
    let globalJS = JSExport.getGlobalJS(context ?? this.context, true, true); // 还需做成读取CapConfig
    let bridgeJS = JSExport.getBridgeJS(context ?? this.context);
    // let pluginJS = JSExport.getPluginJS(this.plugins);
    let pluginJS = JSExport.getFilesContent(context ?? this.context, 'plugin.js')
    let cordovaJS = JSExport.getCordovaJS(context ?? this.context);
    let cordovaPluginsJS = JSExport.getCordovaPluginJS(context ?? this.context);
    let cordovaPluginsFileJS = JSExport.getCordovaPluginsFileJS(context ?? this.context);
    let localUrlJS = "window.WEBVIEW_SERVER_URL = '" + this.localUrl + "';";

    return new JSInjector(
      platformJS,
      globalJS,
      bridgeJS,
      pluginJS,
      cordovaJS,
      cordovaPluginsJS,
      cordovaPluginsFileJS,
      localUrlJS
    );
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

  public getPluginCallForLastActivity() {
    let pluginCallForLastActivity = this.pluginCallForLastActivity;
    this.pluginCallForLastActivity = null;
    return pluginCallForLastActivity;
  }

  public setPluginCallForLastActivity(pluginCallForLastActivity: PluginCall) {
    this.pluginCallForLastActivity = pluginCallForLastActivity;
  }

  public releaseCall(call: PluginCall): void

  public releaseCall(callbackId: string): void

  public releaseCall(call: PluginCall | string) {
    let callbackId: string = call instanceof PluginCall ? call.getCallbackId() : call
    this.savedCalls.remove(callbackId);
  }

  public callPluginMethod(pluginId: string, methodName: string, call: PluginCall): void {
    throw new Error("Method not implemented.");
  }

  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
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
}

