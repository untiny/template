import { CapacitorPlugin } from '../capacitor-harmony/decorators/CapacitorPlugin';
import { PluginMethod } from '../capacitor-harmony/decorators/PluginMethod';
import Plugin from '../capacitor-harmony/Plugin';
import PluginCall from '../capacitor-harmony/PluginCall';
import { Any } from '../capacitor-harmony/Type';

interface x {
  x: string
}
@CapacitorPlugin({ name: 'Echo' })
export default class EchoPlugin extends Plugin {
  @PluginMethod()
  public echo(call: PluginCall) {
    let x:x = {
      x:'ssss'
    }
    this.test(x)
    // call.resolve({ value: "value" })
  }

  test(data: Any) {

  }
}