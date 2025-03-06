import resourceManager from "@ohos.resourceManager";
import { buffer } from "@kit.ArkTS";
import Plugin from "./Plugin";

export interface PluginPackage {
  pkg: string
  classpath: string
}

export default class PluginManager {
  private resourceManager: resourceManager.ResourceManager

  constructor(resourceManager: resourceManager.ResourceManager) {
    this.resourceManager = resourceManager;
  }

  public loadPluginClasses(): Plugin[] {
    let plugins = this.parsePluginsJSON();
    let pluginList: Plugin[] = [];
    plugins.forEach((plugin) => {
      // 用类路径读取到类并加入list
      // java 代码
      // JSONObject pluginJSON = pluginsJSON.getJSONObject(i);
      // String classPath = pluginJSON.getString("classpath");
      // Class<?> c = Class.forName(classPath);
      // pluginList.add(c.asSubclass(Plugin.class));
    })
    return pluginList;
  }

  public parsePluginsJSON() {
    try {
      let data = this.resourceManager.getRawFileContentSync("capacitor.plugins.json");
      let jsonString = buffer.from(data).toString("utf-8");
      return JSON.parse(jsonString) as Array<PluginPackage>;
    } catch (e) {
      throw new Error("Could not parse capacitor.plugins.json as JSON");
    }
  }
}