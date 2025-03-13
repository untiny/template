import { Any } from "./Type"

export default class PluginErrorResult {
  message?: string
  code?: string | null
  data?: Any
}