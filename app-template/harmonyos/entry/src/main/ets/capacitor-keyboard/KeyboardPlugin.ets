import { CapacitorPlugin } from '../capacitor-harmony/decorators/CapacitorPlugin';
import { PluginMethod } from '../capacitor-harmony/decorators/PluginMethod';
import Plugin from '../capacitor-harmony/Plugin';
import PluginCall from '../capacitor-harmony/PluginCall';
import Keyboard from './Keyboard';
import { window } from '@kit.ArkUI';
import Logger from '../capacitor-harmony/Logger';

interface KeyboardEventResult {
  keyboardHeight?: number
}

@CapacitorPlugin({ name: "Keyboard" })
export default class KeyboardPlugin extends Plugin {
  private implementation?: Keyboard

  public load(): void {
    // let resizeOnFullScreen = this.getConfig()?.getBoolean('resizeOnFullScreen', false);
    // this.implementation = new Keyboard(resizeOnFullScreen as boolean);
    // this.implementation.setKeyboardEventListener(this.onKeyboardEvent);
    window.getLastWindow(this.getContext(), (error, currentWindow) => {
      currentWindow.on('keyboardHeightChange', data => {
        let size = px2vp(data);
        Logger.debug(this.getLogType(), 'keyboardHeightChange ' + size.toString());
        this.onKeyboardEvent(size > 0 ? Keyboard.EVENT_KB_WILL_SHOW : Keyboard.EVENT_KB_WILL_HIDE, size);
      })
    })
  }

  @PluginMethod()
  public show(call: PluginCall) {
    call.unimplemented();

  }

  @PluginMethod()
  public hide(call: PluginCall) {
    call.unimplemented();
  }

  @PluginMethod()
  public setAccessoryBarVisible(call: PluginCall) {
    call.unimplemented();
  }

  @PluginMethod()
  public setStyle(call: PluginCall) {
    call.unimplemented();
  }

  @PluginMethod()
  public setResizeMode(call: PluginCall) {
    call.unimplemented();
  }

  @PluginMethod()
  public getResizeMode(call: PluginCall) {
    call.unimplemented();
  }

  @PluginMethod()
  public setScroll(call: PluginCall) {
    call.unimplemented();
  }

  onKeyboardEvent(event: string, size: number) {
    let data: KeyboardEventResult = {}
    switch (event) {
      case Keyboard.EVENT_KB_WILL_SHOW:
      case Keyboard.EVENT_KB_DID_SHOW:
        data.keyboardHeight = size;
        this.bridge?.triggerWindowJSEvent(event, JSON.stringify(data));
        this.notifyListeners(event, data);
        break;
      case Keyboard.EVENT_KB_WILL_HIDE:
      case Keyboard.EVENT_KB_DID_HIDE:
        this.bridge?.triggerWindowJSEvent(event);
        this.notifyListeners(event, data);
        break;
    }
  }

  public handleOnDestroy(): void {
    this.implementation?.setKeyboardEventListener(null);
  }
}
