import { buffer } from '@kit.ArkTS';
import { PluginMethodReturnType } from './decorators/PluginMethod';
import PluginHandle from './PluginHandle';
import { PluginHeader, PluginMethodHeader } from './PluginHeader';
import PluginMethodHandle from './PluginMethodHandle';

export default class JSExport {
  private static CATCHALL_OPTIONS_PARAM = "_options";
  private static CALLBACK_PARAM = "_callback";

  public static getPlatformJS() {
    return "window.CapacitorCustomPlatform = { name: \"harmony\" };"
  }

  public static getGlobalJS(context: Context, loggingEnabled: boolean, isDebug: boolean): string {
    return "window.Capacitor = { DEBUG: " + isDebug + ", isLoggingEnabled: " + loggingEnabled + ", Plugins: {} };";
  }

  public static getPluginJS(plugins: IterableIterator<PluginHandle>): string {
    let lines: string[] = ["// Begin: Capacitor Plugin JS"];
    let headers: PluginHeader[] = [];

    Array.from(plugins).forEach((plugin) => {
      lines.push(
        "(function(w) {\n" +
          "var a = (w.Capacitor = w.Capacitor || {});\n" +
          "var p = (a.Plugins = a.Plugins || {});\n" +
          "var t = (p['" +
        plugin.getId() +
          "'] = {});\n" +
          "t.addListener = function(eventName, callback) {\n" +
          "  return w.Capacitor.addListener('" +
        plugin.getId() +
          "', eventName, callback);\n" +
          "}"
      );

      Array.from(plugin.getMethods()).forEach((method) => {
        if (method.getName() !== "addListener" && method.getName() !== "removeListener") {
          lines.push(JSExport.generateMethodJS(plugin, method))
        }
      })

      lines.push("})(window);\n");

      headers.push(JSExport.createPluginHeader(plugin))
    });

    return lines.join("\n") + "window.Capacitor.PluginHeaders = " + JSON.stringify(headers) + ";";
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

  public static generateMethodJS(plugin: PluginHandle, method: PluginMethodHandle): string {
    let lines: string[] = []
    let args: string[] = []
    args.push(JSExport.CATCHALL_OPTIONS_PARAM)
    let returnType = method.getReturnType()
    if (returnType === PluginMethodReturnType.CALLBACK) {
      args.push(JSExport.CALLBACK_PARAM)
    }
    lines.push("t['" + method.getName() + "'] = function(" + args.join(", ") + ") {");

    switch (returnType) {
      case PluginMethodReturnType.NONE:
        lines.push(
          "return w.Capacitor.nativeCallback('" +
          plugin.getId() +
            "', '" +
          method.getName() +
            "', " +
          JSExport.CATCHALL_OPTIONS_PARAM +
            ")"
        );
        break;
      case PluginMethodReturnType.PROMISE:
        lines.push(
          "return w.Capacitor.nativePromise('" +
          plugin.getId() +
            "', '" +
          method.getName() +
            "', " +
          JSExport.CATCHALL_OPTIONS_PARAM +
            ")"
        );
        break;
      case PluginMethodReturnType.CALLBACK:
        lines.push(
          "return w.Capacitor.nativeCallback('" +
          plugin.getId() +
            "', '" +
          method.getName() +
            "', " +
          JSExport.CATCHALL_OPTIONS_PARAM +
            ", " +
          JSExport.CALLBACK_PARAM +
            ")"
        );
        break;
    }

    lines.push("}");
    return lines.join("\n")
  }

  public static getBridgeJS(context: Context): string {
    return JSExport.getFilesContent(context, "native-bridge.js");
  }

  public static getCordovaJS(context: Context): string {
    let fileContent: string = "";
    return fileContent;
  }

  public static getCordovaPluginsFileJS(context: Context): string {
    let fileContent: string = "";
    return fileContent;
  }

  public static getCordovaPluginJS(context: Context): string {
    return "";
  }
}