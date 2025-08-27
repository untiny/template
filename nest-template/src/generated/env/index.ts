export interface Env {
  DATABASE_URL: string
  SQL_DEBUG: string
  DEBUG: string
  APP_NAME: string
  APP_PORT: string
  SWAGGER_DOCS_PATH: string
  SWAGGER_DOCS_TITLE: string
  SWAGGER_DOCS_DESCRIPTION: string
  SWAGGER_DOCS_VERSION: string
  SWAGGER_TEMPLATE: string
  JWT_ACCESS_SECRET: string
  JWT_ACCESS_EXPIRES_IN: string
  JWT_REFRESH_SECRET: string
  JWT_REFRESH_EXPIRES_IN: string
  WORK_WEI_XIN_WINSTON_BOT_KEY: string
  TZ: string
  FORCE_COLOR: string
  REDIS_URL: string
  REDIS_PASSWORD: string
  REDIS_CACHE_PREFIX: string
  REDIS_SESSION_PREFIX: string
  REDIS_QUEUE_PREFIX: string
}
