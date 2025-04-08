import type { INestApplication } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { OpenAPIObject } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'

class ScalarModule {
  static setup(path: string, app: INestApplication, document: OpenAPIObject, metaData?: { title?: string, description?: string }) {
    app.use(`/${path}`, apiReference({
      content: document,
      metaData,
    }))
  }
}

export async function useSwagger(app: NestExpressApplication) {
  const configService = app.get<ConfigService>(ConfigService)
  const path = configService.get<string>('SWAGGER_DOCS_PATH', 'api-docs')
  const title = configService.get<string>('SWAGGER_DOCS_TITLE', 'API Reference')
  const description = configService.get<string>('SWAGGER_DOCS_DESCRIPTION', 'The service API description')
  const version = configService.get<string>('SWAGGER_DOCS_VERSION', '0.0.1')

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // SwaggerModule.setup(path, app, document, {
  //   customSiteTitle: title,
  // })

  ScalarModule.setup(path, app, document, {
    title,
    description,
  })
}
