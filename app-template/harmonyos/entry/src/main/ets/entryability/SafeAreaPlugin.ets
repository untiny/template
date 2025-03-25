import { CapacitorPlugin } from '../capacitor-harmony/decorators/CapacitorPlugin';
import { PluginMethod } from '../capacitor-harmony/decorators/PluginMethod';
import Plugin from '../capacitor-harmony/Plugin';
import PluginCall from '../capacitor-harmony/PluginCall';
import { window } from '@kit.ArkUI';

export interface SafeArea {
  top: number
  right: number
  bottom: number
  left: number
}

@CapacitorPlugin({ name: "SafeArea" })
export default class SafeAreaPlugin extends Plugin {
  @PluginMethod()
  public getSafeArea(call: PluginCall) {
    let win = this.bridge?.getWindowStage()?.getMainWindowSync();
    let top = win?.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM)
      .topRect;
    let bottom = win?.getWindowAvoidArea(window.AvoidAreaType.TYPE_NAVIGATION_INDICATOR)
      .bottomRect;
    let safArea: SafeArea = {
      top: px2vp(top?.height ?? 0),
      bottom: px2vp(bottom?.height ?? 0),
      left: 0,
      right: 0
    }
    call.resolve(safArea);
  }

  @PluginMethod()
  public getStatusBarHeight(call: PluginCall) {
    let win = this.bridge?.getWindowStage()?.getMainWindowSync();
    let top = win?.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM)
      .topRect;
    return px2vp(top?.height ?? 0);
  }
}