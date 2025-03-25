import { inputMethod, inputMethodEngine } from "@kit.IMEKit";

export default class Keyboard {
  public static EVENT_KB_WILL_SHOW = "keyboardWillShow";
  public static EVENT_KB_DID_SHOW = "keyboardDidShow";
  public static EVENT_KB_WILL_HIDE = "keyboardWillHide";
  public static EVENT_KB_DID_HIDE = "keyboardDidHide";
  private keyboardEventListener?: ((event: string, size: number) => void) | null

  constructor(resizeOnFullScreen: boolean) {
    inputMethodEngine.getInputMethodAbility().on('keyboardShow', () => {
      this.keyboardEventListener?.(Keyboard.EVENT_KB_WILL_SHOW, 0);
    });

    inputMethodEngine.getInputMethodAbility().on('keyboardHide', () => {
      this.keyboardEventListener?.(Keyboard.EVENT_KB_WILL_HIDE, 0);
    });
  }

  public show() {

  }

  public hide() {
  }

  public setKeyboardEventListener(keyboardEventListener: ((event: string, size: number) => void) | null) {
    this.keyboardEventListener = keyboardEventListener;
  }
}