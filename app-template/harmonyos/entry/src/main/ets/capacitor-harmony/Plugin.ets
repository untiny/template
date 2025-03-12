import { Bridge } from './Bridge';
import PluginCall from './PluginCall';
import PluginHandle from './PluginHandle';
import { HashMap, List } from '@kit.ArkTS';
import JSObject from './JSObject';
import { PluginMethod, PluginMethodReturnType } from './decorators/PluginMethod';
import { PermissionCallback } from './decorators/PermissionCallback';
import { AbilityConstant, Want } from '@kit.AbilityKit';

export default class Plugin {
  // 我们将在持久化 Bundle 中使用的 JSON blob 的密钥。
  // 插件调用选项。
  private static BUNDLE_PERSISTED_OPTIONS_JSON_KEY: string = "_json";
  // 桥接器参考
  protected bridge?: Bridge;
  // 对该插件的 PluginHandle 封装器的引用
  protected handle?: PluginHandle;
  // 存储的事件监听器
  private eventListeners: HashMap<string, List<PluginCall>>;
  private lastPluginCallId?: string;
  // 如果事件被解雇，则存储了事件的结果，并且尚未附上听众。仅存储最后一个值。
  private retainedEventArguments: HashMap<string, List<JSObject>>;

  constructor() {
    this.eventListeners = new HashMap<string, List<PluginCall>>();
    this.retainedEventArguments = new HashMap<string, List<JSObject>>();
  }

  public setPluginHandle(handle: PluginHandle) {
    this.handle = handle;
  }

  public getPluginHandle() {
    return this.handle;
  }

  public setBridge(bridge: Bridge) {
    this.bridge = bridge;
  }

  public getBridge() {
    return this.bridge;
  }

  public getContext(): Context {
    return this.bridge?.getContext() as Context;
  }

  public getAppId() {
    return this.getContext().applicationInfo.name;
  }

  /**
   * Called when the plugin has been connected to the bridge
   * and is ready to start initializing.
   */
  public load(): void {
  }

  private addEventListener(eventName: string, call: PluginCall): void {
    let listeners: List<PluginCall> = this.eventListeners.get(eventName);
    if (listeners === null || listeners.isEmpty()) {
      listeners = new List<PluginCall>();
      this.eventListeners.set(eventName, listeners);
      listeners.add(call);
      this.sendRetainedArgumentsForEvent(eventName);
    } else {
      listeners.add(call);
    }
  }


  private removeEventListener(eventName: string, call: PluginCall): void {
    let listeners: List<PluginCall> = this.eventListeners.get(eventName);
    if (!listeners) {
      return;
    }
    listeners.remove(call);
  }

  protected notifyListeners(eventName: string, data: JSObject, retainUntilConsumed: boolean = false): void {
    console.info("Notifying listeners for event " + eventName);
    let listeners: List<PluginCall> = this.eventListeners.get(eventName);
    if (listeners === null || listeners.isEmpty()) {
      console.debug("No listeners found for event " + eventName);
      if (retainUntilConsumed) {
        let argList: List<JSObject> = this.retainedEventArguments.get(eventName);

        if (argList === null) {
          argList = new List<JSObject>();
        }

        argList.add(data);
        this.retainedEventArguments.set(eventName, argList);
      }
      return;
    }

    listeners.forEach((call) => {
      call.resolve(data);
    })
  }

  protected hasListeners(eventName: string): boolean {
    if (!this.eventListeners.hasKey(eventName)) {
      return false;
    }
    return !this.eventListeners.get(eventName).isEmpty();
  }

  private sendRetainedArgumentsForEvent(eventName: string): void {
    let retainedArgs: List<JSObject> = this.retainedEventArguments.get(eventName);
    if (!retainedArgs) {
      return;
    }

    this.retainedEventArguments.remove(eventName);

    retainedArgs.forEach((retained) => {
      this.notifyListeners(eventName, retained)
    })
  }

  @PluginMethod({
    returnType: PluginMethodReturnType.NONE
  })
  public addListener(call: PluginCall): void {
    let eventName = call.getString("eventName") as string;
    call.setKeepAlive(true);
    this.addEventListener(eventName, call);
  }

  @PluginMethod({
    returnType: PluginMethodReturnType.NONE
  })
  public removeListener(call: PluginCall): void {
    let eventName = call.getString("eventName") as string;
    let callbackId = call.getString("callbackId") as string;
    let savedCall = this.bridge?.getSavedCall(callbackId);
    if (savedCall) {
      this.removeEventListener(eventName, savedCall);
      this.bridge?.releaseCall(savedCall);
    }
  }

  @PluginMethod({
    returnType: PluginMethodReturnType.NONE
  })
  public removeAllListeners(call: PluginCall): void {
    this.eventListeners.clear();
    call.resolve();
  }

  @PluginMethod()
  @PermissionCallback()
  public checkPermissions(call: PluginCall): void {
  }

  @PluginMethod()
  public requestPermissions(call: PluginCall): void {
  }


  /**
   * Handle onNewWant
   */
  public handleOnNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
  }

  /**
   * Handle onStart
   */
  public handleOnStart(): void {
  }

  /**
   * Handle onResume
   */
  public handleOnResume(): void {
  }

  /**
   * Handle onPause
   */
  public handleOnPause(): void {
  }

  /**
   * Handle onDestroy
   */
  public handleOnDestroy(): void {
  }
}