import "reflect-metadata";

export interface PluginMetadata {
  name?: string;
  // requestCodes?: number[];
  // permissions
}

export const CAPACITOR_PLUGIN = "capacitor:plugin";

export const CapacitorPlugin = (option?: PluginMetadata): ClassDecorator => {
  return <TFunction extends Function>(target: TFunction) => {
    console.log("CapacitorPlugin", target.name)
    option = option ?? { name: target.name }
    Reflect.defineMetadata(CAPACITOR_PLUGIN, option, target);
  }
}