import { AbilityConstant, ConfigurationConstant, UIAbility, Want } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';
import Bridge from './Bridge';
import CapConfig from './CapConfig';
import BridgeBuilder from './BridgeBuilder';
import Plugin from './Plugin';
import { TypeConstructor } from '@ohos.arkui.StateManagement';
import Logger from './Logger';
import { BusinessError } from '@kit.BasicServicesKit';
import { List } from '@kit.ArkTS';

export default class BridgeAbility extends UIAbility {
  protected bridge?: Bridge;
  protected keepRunning: boolean = true;
  protected config: CapConfig = CapConfig.loadDefault(this.context);
  protected activityDepth: number = 0;
  protected initialPlugins: List<TypeConstructor<Plugin>> = new List<TypeConstructor<Plugin>>();
  protected bridgeBuilder: BridgeBuilder = new BridgeBuilder(this);
  protected windowStage?: window.WindowStage

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
    Logger.info('Ability onCreate');

    Logger.debug("Starting BridgeAbility");
    this.bridge = this.bridgeBuilder.addPlugins(this.initialPlugins).setConfig(this.config).create();
    this.bridge.onNewWant(want, launchParam);
  }


  onWindowStageCreate(windowStage: window.WindowStage): void {
    this.windowStage = windowStage;
    // 设置WindowStage的事件订阅（获焦/失焦、切到前台/切到后台、前台可交互/前台不可交互）
    this.onWindowStageEvent();
    // 创建主窗口，为该功能设置主页面
    Logger.info('Ability onWindowStageCreate');
    this.onStart();

    AppStorage.setOrCreate<Bridge>("bridge", this.bridge);

    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        Logger.error('Failed to load the content. Cause: ' + JSON.stringify(err));
        return;
      }
      Logger.info('Succeeded in loading the content.');
    });
  }

  onWindowStageWillDestroy(windowStage: window.WindowStage) {
    // 释放通过windowStage对象获取的资源
    // 在onWindowStageWillDestroy()中注销WindowStage事件订阅（获焦/失焦、切到前台/切到后台、前台可交互/前台不可交互）
    this.offWindowStageEvent();
  }

  onWindowStageDestroy(): void {
    // 销毁主窗口，释放 UI 相关资源
    Logger.info('Ability onWindowStageDestroy');
    this.bridge?.onDestroy();
  }

  onForeground(): void {
    // Ability has brought to foreground
    Logger.info('Ability onForeground');
  }

  onBackground(): void {
    // Ability has back to background
    Logger.info('Ability onBackground');
  }

  public registerPlugin(plugin: TypeConstructor<Plugin>) {
    this.bridgeBuilder.addPlugin(plugin)
  }

  public registerPlugins(plugins: List<TypeConstructor<Plugin>>) {
    this.bridgeBuilder.addPlugins(plugins);
  }

  public getBridge() {
    return this.bridge;
  }

  private onWindowStageEvent() {
    try {
      this.windowStage?.on('windowStageEvent', (data) => {
        let stageEventType: window.WindowStageEventType = data;
        switch (stageEventType) {
          case window.WindowStageEventType.SHOWN: // 切到前台
            Logger.info(Logger.tags('WindowStage'), 'foreground.');
            break;
          case window.WindowStageEventType.ACTIVE: // 获焦状态
            Logger.info(Logger.tags('WindowStage'), 'active.');
            break;
          case window.WindowStageEventType.INACTIVE: // 失焦状态
            Logger.info(Logger.tags('WindowStage'), 'inactive.');
            break;
          case window.WindowStageEventType.HIDDEN: // 切到后台
            Logger.info(Logger.tags('WindowStage'), 'background.');
            break;
          case window.WindowStageEventType.RESUMED: // 前台可交互状态
            Logger.info(Logger.tags('WindowStage'), 'resumed.');
            this.onResume();
            break;
          case window.WindowStageEventType.PAUSED: // 前台不可交互状态
            Logger.info(Logger.tags('WindowStage'), 'paused.');
            this.onPause();
            break;
          default:
            break;
        }
      });
    } catch (exception) {
      Logger.error(`Failed to enable the listener for window stage event changes. Cause: ${JSON.stringify(exception)}`);
    }
  }

  private offWindowStageEvent() {
    try {
      this.windowStage?.off('windowStageEvent');
    } catch (err) {
      let error = err as BusinessError;
      Logger.error(`Failed to disable the listener for windowStageEvent. Code is ${error?.code}, message is ${error?.message}`);
    }
  }

  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    this.bridge?.onNewWant(want, launchParam);
  }

  public onRestart() {
    Logger.debug('App onRestart');
    this.bridge?.onRestart();
  }

  public onStart() {
    Logger.debug('App onStart');
    this.bridge?.onStart();
  }

  public onResume() {
    Logger.debug('App onResume');
    this.bridge?.onResume();
  }

  public onPause() {
    Logger.debug('App onPause');
    this.bridge?.onPause();
  }

  public onStop() {
    Logger.debug('App onStop');
    this.bridge?.onStop();
  }

  onDestroy() {
    Logger.debug('App onDestroy');
    this.bridge?.onDestroy();
  }
}