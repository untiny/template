import { buffer, HashMap } from "@kit.ArkTS";
import Bridge from "./Bridge";
import PluginConfig from "./PluginConfig";
import { Any, CapacitorConfig, PluginsConfig } from "./Type";
import { resourceManager } from "@kit.LocalizationKit";

export default class CapConfig {
  private static LOG_BEHAVIOR_NONE = "none";
  private static LOG_BEHAVIOR_DEBUG = "debug";
  private static LOG_BEHAVIOR_PRODUCTION = "production";
  // Server Config
  private html5mode = true;
  private serverUrl?: string | null;
  private hostname = "localhost";
  private androidScheme = Bridge.CAPACITOR_HTTPS_SCHEME;
  private allowNavigation: string[] = []
  // Android Config
  private overriddenUserAgentString?: string | null;
  private appendedUserAgentString?: string | null;
  private backgroundColor?: string | null;
  private allowMixedContent = false;
  private captureInput = false;
  private webContentsDebuggingEnabled = false;
  private loggingEnabled = true;
  private initialFocus = true;
  private useLegacyBridge = false;
  private errorPath?: string | null;
  private zoomableWebView = false;
  private resolveServiceWorkerRequests = true;
  // Embedded
  private startPath?: string | null;
  // Plugins
  private pluginsConfiguration = new HashMap<string, PluginConfig>();
  private configConfig: CapacitorConfig = {};

  static loadDefault(context: Context): CapConfig {
    let config = new CapConfig();
    if (!context) {
      console.error("Capacitor Config could not be created from file. Context must not be null.")
      return config;
    }
    config.loadConfigFromResource(context.resourceManager)
    config.deserializeConfig(context);
    return config;
  }

  private loadConfigFromResource(resourceManager: resourceManager.ResourceManager, path?: string) {
    path = path ?? "";
    try {
      let data = resourceManager.getRawFileContentSync(path + "capacitor.config.json");
      let json = buffer.from(data).toString("utf-8");
      this.configConfig = JSON.parse(json);
    } catch (e) {
      console.error("Unable to parse capacitor.config.json. Make sure it's valid json", e);
    }
  }

  private deserializeConfig(context: Context) {
    // this.html5mode = this.configConfig.server?.html5mode ?? this.html5mode;
    this.serverUrl = this.configConfig.server?.url ?? null;
    this.hostname = this.configConfig.server?.hostname ?? this.hostname;
    this.errorPath = this.configConfig.server?.errorPath ?? null;
    let configSchema = this.configConfig.server?.androidScheme ?? this.androidScheme;
    if (this.validateScheme(configSchema)) {
      this.androidScheme = configSchema;
    }

    this.allowNavigation = this.configConfig.server?.allowNavigation ?? [];

    this.pluginsConfiguration = this.deserializePluginsConfig(this.configConfig.plugins ?? {})

  }

  private validateScheme(scheme: string): boolean {
    let invalidSchemes = ["file", "ftp", "ftps", "ws", "wss", "about", "blob", "data"];
    if (invalidSchemes.includes(scheme)) {
      console.warn(scheme + " is not an allowed scheme.  Defaulting to https.");
      return false;
    }

    if (scheme !== "http" && scheme !== "https") {
      console.warn(
        "Using a non-standard scheme: " + scheme +
          " for Android. This is known to cause issues as of Android Webview 117."
      );
    }
    return true;
  }

  private deserializePluginsConfig(pluginsConfig: PluginsConfig) {
    let pluginsMap = new HashMap<string, PluginConfig>();
    if (!pluginsConfig) {
      return pluginsMap;
    }
    Object.keys(pluginsConfig).forEach((pluginId) => {
      let value: Record<string, Any> = Reflect.get(pluginsConfig, pluginId) ?? {};
      let pluginConfig = new PluginConfig(value);
      pluginsMap.set(pluginId, pluginConfig);
    })
    return pluginsMap;
  }

  public isHTML5Mode() {
    return this.html5mode;
  }

  public getServerUrl() {
    return this.serverUrl;
  }

  public getErrorPath() {
    return this.errorPath;
  }

  public getHostname() {
    return this.hostname;
  }

  public getStartPath() {
    return this.startPath;
  }

  public getAndroidScheme() {
    return this.androidScheme;
  }

  public getAllowNavigation() {
    return this.allowNavigation;
  }

  public getOverriddenUserAgentString() {
    return this.overriddenUserAgentString;
  }

  public getAppendedUserAgentString() {
    return this.appendedUserAgentString;
  }

  public getBackgroundColor() {
    return this.backgroundColor;
  }

  public isMixedContentAllowed() {
    return this.allowMixedContent;
  }

  public isInputCaptured() {
    return this.captureInput;
  }

  public isResolveServiceWorkerRequests() {
    return this.resolveServiceWorkerRequests;
  }

  public isWebContentsDebuggingEnabled() {
    return this.webContentsDebuggingEnabled;
  }

  public isZoomableWebView() {
    return this.zoomableWebView;
  }

  public isLoggingEnabled() {
    return this.loggingEnabled;
  }

  public isInitialFocus() {
    return this.initialFocus;
  }

  public isUsingLegacyBridge() {
    return this.useLegacyBridge;
  }

  public getPluginConfiguration(pluginId: string): PluginConfig {
    return this.pluginsConfiguration.get(pluginId) ?? new PluginConfig();
  }
}