import { UIAbility } from "@kit.AbilityKit";
import CapConfig from "./CapConfig";
import { TypeConstructor } from "@ohos.arkui.StateManagement";
import Plugin from "./Plugin";
import { List } from "@kit.ArkTS";
import ServerPath from "./ServerPath";
import Bridge from "./Bridge";
import { webview } from "@kit.ArkWeb";

export default class BridgeBuilder {
  private ability: UIAbility;
  private config?: CapConfig;
  private plugins: List<TypeConstructor<Plugin>> = new List<TypeConstructor<Plugin>>();
  private pluginInstances: List<Plugin> = new  List<Plugin>();
  private serverPath?: ServerPath;

  constructor(ability: UIAbility) {
    this.ability = ability;
  }

  public setConfig(config: CapConfig) {
    this.config = config;
    return this;
  }

  public setPlugins(plugins: List<TypeConstructor<Plugin>>) {
    this.plugins = plugins;
    return this;
  }

  public addPlugin(plugin: TypeConstructor<Plugin>) {
    this.plugins.add(plugin);
    return this;
  }

  public addPlugins(plugins: List<TypeConstructor<Plugin>>) {
    plugins.forEach((plugin) => {
      this.addPlugin(plugin)
    })
    return this;
  }

  public addPluginInstance(plugin: Plugin) {
    this.pluginInstances.add(plugin);
  }

  public addPluginInstances(plugins: List<Plugin>) {
    plugins.forEach((plugin) => {
      this.addPluginInstance(plugin)
    })
    return this;
  }

  public setServerPath(serverPath: ServerPath) {
    this.serverPath = serverPath;
    return this;
  }

  public create() {
    let controller: webview.WebviewController = new webview.WebviewController();
    let bridge = new Bridge(
      this.ability.context,
      controller,
      this.plugins,
      this.pluginInstances,
      this.config
    );
    return bridge;
  }
}