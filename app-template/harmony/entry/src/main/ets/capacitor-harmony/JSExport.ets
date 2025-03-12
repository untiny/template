import { buffer, HashMap } from "@kit.ArkTS";
import PluginHandle from "./PluginHandle";
import { PluginHeader, PluginMethodHeader } from "./PluginHeader";
import PluginMethodHandle from "./PluginMethodHandle";

export default class JSExport {
  private static CATCHALL_OPTIONS_PARAM = "_options";
  private static CALLBACK_PARAM = "_callback";

  public static getPlatformJS() {
    return "window.CapacitorCustomPlatform = { name: \"harmony\" };"
  }

  public static getGlobalJS(context: Context, loggingEnabled: boolean, isDebug: boolean): string {
    return "window.Capacitor = { DEBUG: " + isDebug + ", isLoggingEnabled: " + loggingEnabled + ", Plugins: {} };";
  }

  public static getCordovaJS(context: Context): string {
    let fileContent: string = "";
    return fileContent;
  }

  public static getCordovaPluginsFileJS(context: Context): string {
    let fileContent: string = "";
    return fileContent;
  }

  public static getPluginJS(plugins: HashMap<string, PluginHandle>): string {
    let headers: PluginHeader[] = [
      {
        name: "App",
        methods: [
          { name: "getState", rtype: "promise" },
          { name: "getInfo", rtype: "promise" },
          { name: "removeAllListeners", rtype: "promise" },
          { name: "getLaunchUrl", rtype: "promise" },
          { name: "checkPermissions", rtype: "promise" },
          { name: "requestPermissions", rtype: "promise" },
          { name: "exitApp", rtype: "promise" },
          { name: "removeListener" },
          { name: "addListener" },
          { name: "minimizeApp", rtype: "promise" },
        ],
      },
    ]
    // plugins.forEach((plugin) => {
    //   if (plugin) {
    //     headers.push(JSExport.createPluginHeader(plugin))
    //   }
    // })
    return "window.Capacitor.PluginHeaders = " + JSON.stringify(headers) + ";";
  }

  public static getCordovaPluginJS(context: Context): string {
    return "";
  }

  public static getFilesContent(context: Context, path: string): string {
    let resourceManager = context.resourceManager;
    let data = resourceManager.getRawFileContentSync(path)
    return buffer.from(data).toString("utf-8");
  }

  public static createPluginHeader(plugin: PluginHandle) {
    let header: PluginHeader = {
      name: plugin.getId(),
      methods: []
    }
    Array.from(plugin.getMethods()).forEach((method) => {
      header.methods.push(JSExport.createPluginMethodHeader(method))
    })
    return header;
  }

  public static createPluginMethodHeader(method: PluginMethodHandle): PluginMethodHeader {
    return {
      name: method.getName(),
      rtype: method.getReturnType()
    }
  }

  public static getBridgeJS(context: Context): string {
    return JSExport.getFilesContent(context, "native-bridge.js");
  }

  public static generateMethodJS(): string {
    return "";
  }
}