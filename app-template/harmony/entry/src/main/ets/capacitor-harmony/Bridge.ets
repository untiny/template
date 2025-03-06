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
  private localUrl: string = "http://localhost";
  private appUrl?: string;
  private appUrlConfig?: string;
  private allowedOriginRules: HashSet<string> = new HashSet<string>();
  private authorities: string[] = [];
  private webView: webview.WebviewController;
  private app: App;
  private msgHandler: MessageHandler;
  private initialPlugins: List<Plugin>;
  private pluginInstances: List<Plugin>;
  private plugins: HashMap<string, PluginHandle> = new HashMap<string, PluginHandle>();
  private savedCalls: HashMap<string, PluginCall> = new HashMap<string, PluginCall>();
  private savedPermissionCallIds: HashMap<string, LinkedList<string>> = new HashMap<string, LinkedList<string>>();
  private pluginCallForLastActivity: PluginCall | null = null;
  // private intentUri: uri.URI;
  private serverPath: ServerPath;
  private fragment: null;
  private cordovaInterface: null;
  private preferences: null;

  constructor(
    context: Context,
    serverPath: ServerPath,
    fragment: null,
    webView: webview.WebviewController,
    initialPlugins: List<Plugin>,
    pluginInstances: List<Plugin>,
    cordovaInterface: null,
    pluginManager: PluginManager,
    preferences: null,
    config: CapConfig
  ) {
    this.app = new App();
    this.serverPath = serverPath;
    this.context = context;
    this.fragment = fragment;
    this.webView = webView;
    // this.webViewClient = new BridgeWebViewClient(this);
    this.initialPlugins = initialPlugins;
    this.pluginInstances = pluginInstances;
    this.cordovaInterface = cordovaInterface;
    this.preferences = preferences;
    this.config = config ?? CapConfig.loadDefault(context);
    this.initWebView();
    this.setAllowedOriginRules();
    this.msgHandler = new MessageHandler(this, webView, pluginManager);
    this.registerAllPlugins();
    this.loadWebView();
  }

  public getApp() {
    return this.app;
  }

  private loadWebView() {

  }

  private initWebView() {
  }

  private setAllowedOriginRules() {
  }

  private registerAllPlugins() {
  }

  private getJSInjector(): JSInjector {
    let globalJS = JSExport.getGlobalJS(this.context, true, true); // 还需做成读取CapConfig
    let bridgeJS = JSExport.getBridgeJS(this.context);
    let pluginJS = JSExport.getPluginJS(); // plugins.values()
    let cordovaJS = JSExport.getCordovaJS(this.context);
    let cordovaPluginsJS = JSExport.getCordovaPluginJS(this.context);
    let cordovaPluginsFileJS = JSExport.getCordovaPluginsFileJS(this.context);
    let localUrlJS = "window.WEBVIEW_SERVER_URL = '" + this.localUrl + "';";

    return new JSInjector(globalJS, bridgeJS, pluginJS, cordovaJS, cordovaPluginsJS, cordovaPluginsFileJS, localUrlJS);
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
}

