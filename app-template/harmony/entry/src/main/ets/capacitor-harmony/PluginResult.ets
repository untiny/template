export default class PluginResult {
  private json = new Object();

  public put(name: string, value: boolean | number | Date | string | object) {
    this.json[name] = value;
  }

  public toString(): string {

  }

  /**
   * 返回插件元数据以及有关结果的信息，如果它成功了数据，或者如果没有成功，则错误信息。
   * 这用于ApploSestoreRectult，因为从技术上讲，这是插件的原始数据响应。
   * @return插件中的原始数据响应。
   */
  public getWrappedResult(): JSObject {

  }
}