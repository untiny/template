import { Any } from "./Type";

export default class PluginConfig {
  private config: Record<string, Any>

  constructor(config?: Record<string, Any>) {
    this.config = config ?? {};
  }
}