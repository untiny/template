export interface Env {
  DATABASE_URL: string;
  SQL_DEBUG: string;
  APP_PORT: string;
  SWAGGER_DOCS_PATH: string;
  SWAGGER_DOCS_TITLE: string;
  SWAGGER_DOCS_DESCRIPTION: string;
  SWAGGER_DOCS_VERSION: string;
  SWAGGER_TEMPLATE: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
}
