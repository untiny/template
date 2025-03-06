import JSExport from "./JSExport";
import JSInjector from "./JSInjector";
import PluginCall from "./PluginCall";

export default class Bridge {
  private context: Context
  private localUrl: string = "http://localhost"

  constructor(context: Context) {
    this.context = context;

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

  public releaseCall(call: PluginCall) {
    throw new Error("Method not implemented.");
  }

  public callPluginMethod(pluginId: string, methodName: string, call: PluginCall): void {
    throw new Error("Method not implemented.");
  }
}

