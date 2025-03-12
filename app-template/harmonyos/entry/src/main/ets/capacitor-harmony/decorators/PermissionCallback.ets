import "reflect-metadata";


export const PermissionCallback = () => {
  return (target: Object, propertyKey: string | Symbol) => {
    Reflect.defineMetadata('capacitor:permission:callback', propertyKey, target);
  }
}