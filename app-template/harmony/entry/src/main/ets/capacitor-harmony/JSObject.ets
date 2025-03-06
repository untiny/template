import { isInt, isObject } from "./Utils";
import { JSON } from "@kit.ArkTS";

export default class JSObject {
  private json: Record<string, Object | null> = {};

  constructor()

  constructor(json: string)

  constructor(json: Record<string, Object>, names: string[])

  constructor(json?: string | Record<string, Object>, names?: string[]) {
    try {
      if (json && typeof json === "string") {
        this.json = JSON.parse(json) as Record<string, Object>;
      } else if (json && isObject(json) && Array.isArray(names) && names.length > 0) {
        names.forEach((name) => {
          this.json[name] = json[name]
        });
      }
    } catch (e) {
      console.error("JSObject", json, e);
    }
  }

  public static fromJSONObject(obj: Record<string, Object>) {
    let keys = Object.keys(obj);
    return new JSObject(obj, keys);
  }

  public get(name: string): Object {
    return this.get(name);
  }

  public getString(name: string, defaultValue: string | null = null): string | null {
    let value: Object = this.get(name);
    if (value === null) {
      return defaultValue;
    }

    if (typeof value === "string") {
      return value;
    }

    return defaultValue;
  }

  public getInteger(name: string, defaultValue: number | null = null): number | null {
    let value: Object = this.get(name);
    if (value === null) {
      return defaultValue;
    }

    if (typeof value === "number" && isInt(value)) {
      return value;
    }

    return defaultValue;
  }

  public getNumber(name: string, defaultValue: number | null = null): number | null {
    let value: Object = this.get(name);
    if (value === null) {
      return defaultValue;
    }

    if (typeof value === "number") {
      return value;
    }

    return defaultValue;
  }

  public getBoolean(name: string, defaultValue: boolean = false): boolean {
    let value: Object = this.get(name);
    if (value === null) {
      return defaultValue;
    }

    if (typeof value === "boolean") {
      return value;
    }

    return defaultValue;
  }

  public getObject(name: string, defaultValue: Object | null = null): Object | null {
    let value: Object = this.get(name);
    if (value === null) {
      return defaultValue;
    }

    if (isObject(value)) {
      return value;
    }

    return defaultValue;
  }

  public getArray(name: string, defaultValue: Array<Object> = []): Array<Object> {
    let value: Object = this.get(name);
    if (value === null) {
      return defaultValue;
    }

    if (Array.isArray(value)) {
      return value;
    }

    return defaultValue;
  }

  public getJSObject(name: string, defaultValue: JSObject | null = null): JSObject | null {
    try {
      let value: Object = this.get(name);
      if (isObject(value)) {
        let keys = Object.keys(value);
        return new JSObject(value as Record<string, Object>, keys);
      }
    } catch (e) {
    }
    return defaultValue;
  }

  public put(name: string, value: boolean | number | Date | Object | null) {
    this.json[name] = value;
  }

  public toString() {
    return JSON.stringify(this.json);
  }
}