import { CapacitorPlugin } from '../capacitor-harmony/decorators/CapacitorPlugin';
import { PluginMethod } from '../capacitor-harmony/decorators/PluginMethod';
import Plugin from '../capacitor-harmony/Plugin';
import PluginCall from '../capacitor-harmony/PluginCall';

@CapacitorPlugin({ name: 'Echo' })
export default class EchoPlugin extends Plugin {
  @PluginMethod()
  public echo(call: PluginCall) {
    // call.resolve({ value: "value" })
  }
}