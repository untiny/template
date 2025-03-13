import JSObject from "./JSObject";
import { Any } from "./Type";

export default class PluginConfig extends JSObject {
  constructor(config?: Record<string, Any>) {
    super()
    this.json = config ?? {};
  }
}