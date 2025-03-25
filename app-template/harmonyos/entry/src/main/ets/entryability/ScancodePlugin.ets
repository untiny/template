import { AbilityStageContext, MPFramework } from '@mpaas/framework';
import { CapacitorPlugin } from '../capacitor-harmony/decorators/CapacitorPlugin';
import { PluginMethod } from '../capacitor-harmony/decorators/PluginMethod';
import Plugin from '../capacitor-harmony/Plugin';
import PluginCall from '../capacitor-harmony/PluginCall';
import { ScanInterface, ScanManager } from '@mpaas/scanapp';
import { router } from '@kit.ArkUI';
import Logger from '../capacitor-harmony/Logger';

interface ScancodeResult {
  type?: string;
  data: string
}

@CapacitorPlugin({ name: 'Scancode' })
export default class ScancodePlugin extends Plugin {
  public load(): void {
    MPFramework.create(this.bridge?.getContext() as AbilityStageContext);
  }

  @PluginMethod()
  public start(call: PluginCall) {
    let notSupportAlbum = call.getBoolean("notSupportAlbum", false);
    ScanManager.defaultManager(new ScanDefault(
      (result) => {
        Logger.debug(this.getLogType(), "ScancodeResult: " + result)
        let data: ScancodeResult = { data: result }
        router.back();
        call.resolve(data);
      },
      !notSupportAlbum
    ));
    router.pushNamedRoute({
      name: 'CustomScan'
    })
  }
}

class ScanDefault implements ScanInterface {
  getResult(result: string): void {
    this.callback(result);
  }

  customParams?: Map<string, Object>
  callback: (result: string) => void

  constructor(callback: (result: string) => void, showAlbum?: boolean) {
    this.callback = callback;
    let params = new Map<string, Object>();
    params.set('showAlbum', showAlbum ?? true);
    params.set('fullScreen', true) //是否开启全屏渲染
    this.customParams = params;
  }
}