export default class JSInjector {
  private globalJS: string;
  private bridgeJS: string;
  private pluginJS: string;
  private cordovaJS: string;
  private cordovaPluginsJS: string;
  private cordovaPluginsFileJS: string;
  private localUrlJS: string;

  constructor(
    globalJS: string,
    bridgeJS: string,
    pluginJS: string,
    cordovaJS: string,
    cordovaPluginsJS: string,
    cordovaPluginsFileJS: string,
    localUrlJS: string,
  ) {
    this.globalJS = globalJS;
    this.bridgeJS = bridgeJS;
    this.pluginJS = pluginJS;
    this.cordovaJS = cordovaJS;
    this.cordovaPluginsJS = cordovaPluginsJS;
    this.cordovaPluginsFileJS = cordovaPluginsFileJS;
    this.localUrlJS = localUrlJS;
  }

  public getScriptString(): string {
    return (
      this.globalJS +
        "\n\n" +
      this.localUrlJS +
        "\n\n" +
      this.bridgeJS +
        "\n\n" +
      this.pluginJS +
        "\n\n" +
      this.cordovaJS +
        "\n\n" +
      this.cordovaPluginsFileJS +
        "\n\n" +
      this.cordovaPluginsJS
    );
  }

  public getInjectedHtml(html: string) {
    let js = "<script type=\"text/javascript\">" + this.getScriptString() + "</script>";
    return html.replace("<head>", "<head>" + js);
  }
}