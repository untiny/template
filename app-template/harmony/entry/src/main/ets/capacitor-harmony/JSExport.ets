import { buffer } from "@kit.ArkTS";

export default class JSExport {
  private static CATCHALL_OPTIONS_PARAM = "_options";
  private staticCALLBACK_PARAM = "_callback";

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

  public static getPluginJS(): string {
    return "";
  }

  public static getCordovaPluginJS(context: Context): string {
    return "";
  }

  public static getFilesContent(context: Context, path: string): string {
    let resourceManager = context.resourceManager;
    let data = resourceManager.getRawFileContentSync(path)
    return buffer.from(data).toString("utf-8");
  }

  public static createPluginHeader() {
  }

  public static createPluginMethodHeader() {
  }

  public static getBridgeJS(context: Context): string {
    return JSExport.getFilesContent(context, "native-bridge.js");
  }

  public static generateMethodJS(): string {
    return "";
  }
}