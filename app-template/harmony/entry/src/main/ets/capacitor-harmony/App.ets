import PluginResult from "./PluginResult";

export type AppStatusChangeListener = (isActive: boolean) => void

export type AppRestoredListener = (result: PluginResult) => void

export default class App {
  private statusChangeListener?: AppStatusChangeListener
  private appRestoredListener?: AppRestoredListener;
  private __isActive: boolean = false;

  public isActive(): boolean {
    return this.__isActive;
  }

  public setStatusChangeListener(listener: AppStatusChangeListener): void {
    this.statusChangeListener = listener;
  }

  public setAppRestoredListener(listener: AppRestoredListener): void {
    this.appRestoredListener = listener;
  }

  public fireRestoredResult(result: PluginResult): void {
    this.appRestoredListener?.(result);
  }

  public fireStatusChange(isActive: boolean): void {
    this.__isActive = isActive;
    this.statusChangeListener?.(isActive);
  }
}