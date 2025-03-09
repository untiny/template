import JSObject from "./JSObject";
import { Any } from "./Type";

// export type PluginResultData = Record<string, Object | null>
//
// export interface PluginResultError {
//   message: string
// }
//
// export interface PluginResult {
//   callbackId?: string;
//   methodName?: string;
//   data: PluginResultData;
//   success: boolean;
//   error?: PluginResultError;
//   pluginId?: string;
//   save?: boolean;
// }

export default class PluginResult {
  private json: JSObject;

  constructor(json?: JSObject) {
    this.json = json ?? new JSObject();
  }

  public put(name: string, value: boolean | number | Date | Object | PluginResult | null) {
    try {
      if (value instanceof PluginResult) {
        this.json.put(name, value.json);
      } else {
        this.json.put(name, value);
      }
    } catch (e) {
      console.error("Plugin", e);
    }
  }

  public toString(): string {
    return this.json.toString();
  }

  public toObject(): Record<string, Any> {
    return this.json.toObject();
  }

  /**
   * 返回插件元数据以及有关结果的信息，如果它成功了数据，或者如果没有成功，则错误信息。
   * 这用于ApploSestoreRectult，因为从技术上讲，这是插件的原始数据响应。
   * @return插件中的原始数据响应。
   */
  public getWrappedResult(): JSObject {
    let ret = new JSObject();
    ret.put("pluginId", this.json.getString("pluginId"));
    ret.put("methodName", this.json.getString("methodName"));
    ret.put("success", this.json.getBoolean("success", false));
    ret.put("data", this.json.getJSObject("data"));
    ret.put("error", this.json.getJSObject("error"));
    return ret;
  }
}