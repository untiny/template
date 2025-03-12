import CapConfig from "./CapConfig";
import { hilog } from "@kit.PerformanceAnalysisKit";

export default class Logger {
  public static DOMAIN = 0x0000;
  public static LOG_TAG_CORE = "Capacitor";
  public static config: CapConfig;
  private static instance: Logger;

  private static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance;
  }

  private loadConfig(config: CapConfig) {
    Logger.config = config;
  }


  public static init(config: CapConfig) {
    Logger.getInstance().loadConfig(config);
  }

  public static tags(...tags: string[]) {
    if (tags?.length > 0) {
      return Logger.LOG_TAG_CORE + "/" + tags.join("/");
    }
    return Logger.LOG_TAG_CORE;
  }

  public static info(message: string): void

  public static info(tag: string, message: string): void

  public static info(tag: string, message?: string): void {
    if (!Logger.shouldLog()) {
      return
    }


    if (message) {
      hilog.info(Logger.DOMAIN, tag, "%{public}s", message);
    } else {
      hilog.info(Logger.DOMAIN, Logger.LOG_TAG_CORE, "%{public}s", tag);
    }
  }

  public static warn(message: string): void

  public static warn(tag: string, message: string): void

  public static warn(tag: string, message?: string): void {
    if (!Logger.shouldLog()) {
      return
    }
    if (message) {
      hilog.warn(Logger.DOMAIN, tag, "%{public}s", message);
    } else {
      hilog.warn(Logger.DOMAIN, Logger.LOG_TAG_CORE, "%{public}s", tag);
    }
  }

  public static error(message: string): void

  public static error(tag: string, message: string): void

  public static error(tag: string, message?: string): void {
    if (!Logger.shouldLog()) {
      return
    }
    if (message) {
      hilog.error(Logger.DOMAIN, tag, "%{public}s", message);
    } else {
      hilog.error(Logger.DOMAIN, Logger.LOG_TAG_CORE, "%{public}s", tag);
    }
  }

  public static debug(message: string): void

  public static debug(tag: string, message: string): void

  public static debug(tag: string, message?: string): void {
    if (!Logger.shouldLog()) {
      return
    }
    if (message) {
      hilog.debug(Logger.DOMAIN, tag, "%{public}s", message);
    } else {
      hilog.debug(Logger.DOMAIN, Logger.LOG_TAG_CORE, "%{public}s", tag);
    }
  }

  public static fatal(message: string): void

  public static fatal(tag: string, message: string): void

  public static fatal(tag: string, message?: string): void {
    if (!Logger.shouldLog()) {
      return
    }
    if (message) {
      hilog.fatal(Logger.DOMAIN, tag, "%{public}s", message);
    } else {
      hilog.fatal(Logger.DOMAIN, Logger.LOG_TAG_CORE, "%{public}s", tag);
    }
  }

  public static shouldLog() {
    return !Logger.config || Logger.config.isLoggingEnabled();
  }
}