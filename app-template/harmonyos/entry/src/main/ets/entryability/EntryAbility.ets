import BridgeAbility from '../capacitor-harmony/BridgeAbility';
import AbilityConstant from '@ohos.app.ability.AbilityConstant';
import Want from '@ohos.app.ability.Want';
import EchoPlugin from './EchoPlugin';
import AppPlugin from '../capacitor-app/AppPlugin';
import SafeAreaPlugin from './SafeAreaPlugin';
import KeyboardPlugin from '../capacitor-keyboard/KeyboardPlugin';
import ScancodePlugin from './ScancodePlugin';

export default class EntryAbility extends BridgeAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    super.onCreate(want, launchParam); // 要触发父级函数哦
    this.registerPlugin(EchoPlugin);
    this.registerPlugin(AppPlugin);
    this.registerPlugin(SafeAreaPlugin);
    this.registerPlugin(KeyboardPlugin);
    this.registerPlugin(ScancodePlugin);
  }
}