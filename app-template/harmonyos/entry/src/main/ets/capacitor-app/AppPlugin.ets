import { CapacitorPlugin } from '../capacitor-harmony/decorators/CapacitorPlugin';
import { PluginMethod } from '../capacitor-harmony/decorators/PluginMethod';
import Logger from '../capacitor-harmony/Logger';
import Plugin from '../capacitor-harmony/Plugin';
import PluginCall from '../capacitor-harmony/PluginCall';
import { window } from '@kit.ArkUI';
import { AbilityConstant, common, Want } from '@kit.AbilityKit';

export interface AppInfo {
  name: string
  id: string
  build: string
  version: string
}

@CapacitorPlugin({ name: 'App' })
export default class AppPlugin extends Plugin {
  private static EVENT_BACK_BUTTON = "backButton";
  private static EVENT_URL_OPEN = "appUrlOpen";
  private static EVENT_STATE_CHANGE = "appStateChange";
  private static EVENT_RESTORED_RESULT = "appRestoredResult";
  private static EVENT_PAUSE = "pause";
  private static EVENT_RESUME = "resume";
  private hasPausedEver = false;

  public load() {
    this.bridge?.getApp().setStatusChangeListener((isActive) => {
      Logger.debug(this.getLogType(), "Firing change: " + isActive);
      let data: ESObject = { isActive };
      this.notifyListeners(AppPlugin.EVENT_STATE_CHANGE, data, false);
    })
    this.bridge?.getApp().setAppRestoredListener(result => {
      Logger.debug(this.getLogType(), "Firing restored result");
      this.notifyListeners(AppPlugin.EVENT_RESTORED_RESULT, result, true);
    })
    this.bridge?.addBackPressedCallback(() => {
      let canGoBack = this.bridge?.webviewController.accessBackward();
      if (!this.hasListeners(AppPlugin.EVENT_BACK_BUTTON) && canGoBack) {
        this.bridge?.webviewController.backward();
      } else {
        let data: ESObject = { canGoBack: this.bridge?.webviewController.accessBackward() };
        this.notifyListeners(AppPlugin.EVENT_BACK_BUTTON, data, true);
        this.bridge?.triggerJSEvent("backbutton", "document");
      }
    })
  }

  @PluginMethod()
  public exitApp(call: PluginCall) {
    this.unsetAppListeners()
    call.resolve();
    let context = this.getContext() as common.UIAbilityContext;
    context.terminateSelf();
  }

  @PluginMethod()
  public minimizeApp(call: PluginCall) {
    this.unsetAppListeners()
    call.resolve();
    window.getLastWindow(this.getContext(), (error, windowClass) => windowClass.minimize())
  }

  @PluginMethod()
  public getInfo(call: PluginCall) {
    try {
      let appInfo: AppInfo = {
        id: this.getContext().applicationInfo.label,
        name: this.getContext().applicationInfo.name,
        build: 'unknown',
        version: 'unknown'
      }
      call.resolve(appInfo);
    } catch (e) {
      call.reject("Unable to get App Info");
    }
  }

  @PluginMethod()
  public getLaunchUrl(call: PluginCall) {

  }

  @PluginMethod()
  public getState(call: PluginCall) {
    let data: ESObject = {
      isActive: this.bridge?.getApp().isActive()
    }
    call.resolve(data);
  }

  public handleOnNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    super.handleOnNewWant(want, launchParam);
    // this.notifyListeners(AppPlugin.EVENT_URL_OPEN, { url: 'xxxx' }, true)
  }

  public handleOnPause(): void {
    super.handleOnPause();
    this.hasPausedEver = true;
    this.notifyListeners(AppPlugin.EVENT_PAUSE, null);
  }

  public handleOnResume(): void {
    super.handleOnResume();
    this.hasPausedEver = true;
    this.notifyListeners(AppPlugin.EVENT_RESUME, null);
  }

  public handleOnDestroy(): void {
    this.unsetAppListeners();
  }

  private unsetAppListeners() {
    this.bridge?.getApp().setStatusChangeListener(null);
    this.bridge?.getApp().setAppRestoredListener(null);
  }
}