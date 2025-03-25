import { Any } from './Type';

export type AppStatusChangeListener = (isActive: boolean) => void

export type AppRestoredListener = (result: Any) => void

export default class App {
  private statusChangeListener?: AppStatusChangeListener | null
  private appRestoredListener?: AppRestoredListener | null;
  private __isActive: boolean = false;

  public isActive(): boolean {
    return this.__isActive;
  }

  public setStatusChangeListener(listener: AppStatusChangeListener | null): void {
    this.statusChangeListener = listener;
  }

  public setAppRestoredListener(listener: AppRestoredListener | null): void {
    this.appRestoredListener = listener;
  }

  public fireRestoredResult(result: Any): void {
    this.appRestoredListener?.(result);
  }

  public fireStatusChange(isActive: boolean): void {
    this.__isActive = isActive;
    this.statusChangeListener?.(isActive);
  }
}