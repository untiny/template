import Plugin from "../Plugin";
import { CapacitorPlugin } from "../decorators/CapacitorPlugin";
import PluginCall from "../PluginCall";
import { PluginMethod } from "../decorators/PluginMethod";

@CapacitorPlugin()
export default class CapacitorHttp extends Plugin {
  @PluginMethod()
  public get(call: PluginCall): void {
  }

  @PluginMethod()
  public post(call: PluginCall): void {
  }

  http() {
  }
}