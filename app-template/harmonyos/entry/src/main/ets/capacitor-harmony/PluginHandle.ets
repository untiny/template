import { Bridge } from './Bridge';
import Plugin from './Plugin';
import { TypeConstructor } from '@ohos.arkui.StateManagement';
import { HashMap } from '@kit.ArkTS';
import PluginMethodHandle from './PluginMethodHandle';
import { CAPACITOR_PLUGIN, PluginMetadata } from './decorators/CapacitorPlugin';
import { CAPACITOR_PLUGIN_METHOD, PluginMethodMetadata } from './decorators/PluginMethod';
import PluginCall from './PluginCall';

export default class PluginHandle {
  private bridge: Bridge;
  private pluginClass: TypeConstructor<Plugin>;
  private pluginMethods = new HashMap<string, PluginMethodHandle>();
  private pluginId: string
  private pluginMetadata: PluginMetadata;
  private instance?: Plugin;

  constructor(pluginClass: TypeConstructor<Plugin>, bridge: Bridge) {
    this.pluginClass = pluginClass;
    this.bridge = bridge;
    let pluginMetadata: PluginMetadata = Reflect.getMetadata(CAPACITOR_PLUGIN, pluginClass);
    this.pluginId = pluginMetadata.name ?? this.pluginClass.name;
    this.pluginMetadata = pluginMetadata;
    this.indexMethods(this.pluginClass);
    this.load();
  }

  public load(): Plugin {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new this.pluginClass();
    return this.loadInstance(this.instance);
  }

  public loadInstance(plugin: Plugin): Plugin {
    this.instance = plugin;
    this.instance.setPluginHandle(this);
    this.instance.setBridge(this.bridge);
    this.instance.load();
    return this.instance;
  }


  private indexMethods(pluginClass: TypeConstructor<Plugin>) {
    const properties = Reflect.ownKeys(pluginClass.prototype);
    properties.forEach((name) => {
      let method: Function = Reflect.get(pluginClass.prototype, name);
      let methodMetadata: PluginMethodMetadata = Reflect.getMetadata(CAPACITOR_PLUGIN_METHOD, method);
      if (typeof method === "function" && name !== "constructor" && methodMetadata) {
        let methodHandle = new PluginMethodHandle(method, methodMetadata);
        this.pluginMethods.set(method.name, methodHandle);
      }
    });
  }

  public getPluginClass() {
    return this.pluginClass;
  }

  public getId() {
    return this.pluginId;
  }

  public getPluginMetadata() {
    return this.pluginMetadata;
  }

  public getInstance() {
    return this.instance;
  }

  public getMethods(): IterableIterator<PluginMethodHandle> {
    return this.pluginMethods.values();
  }

  public invoke(methodName: string, call: PluginCall) {
    if (!this.instance) {
      this.load();
    }
    let methodHandle = this.pluginMethods.get(methodName);
    if (!methodHandle) {
      throw new Error("No method " + methodName + " found for plugin " + this.pluginClass.name);
    }
    Reflect.get(this.instance as Plugin, methodHandle.getName(), this.instance)(call);
  }
}