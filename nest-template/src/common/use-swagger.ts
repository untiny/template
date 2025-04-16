import type { INestApplication } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { OpenAPIObject } from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { Env } from 'src/generated/env'
import { Language, languages } from './enums/language.enum'

class ScalarModule {
  static setup(path: string, app: INestApplication, document: OpenAPIObject, metaData?: { title?: string, description?: string }) {
    app.use(`/${path}-json`, (req: Request, res: Response) => {
      res.type('application/json')
      res.send(document)
    })

    app.use(`/${path}`, apiReference({
      content: document,
      metaData,
      theme: 'default',
      layout: 'modern',
      hideClientButton: true,
      hideModels: false,
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'ofetch',
      },
    }))
  }
}

export async function useSwagger(app: NestExpressApplication) {
  const configService = app.get<ConfigService<Env>>(ConfigService)
  const path = configService.get<string>('SWAGGER_DOCS_PATH', 'api-docs')
  const title = configService.get<string>('SWAGGER_DOCS_TITLE', 'API Reference')
  const description = configService.get<string>('SWAGGER_DOCS_DESCRIPTION', 'The service API description')
  const version = configService.get<string>('SWAGGER_DOCS_VERSION', '0.0.1')
  const template = configService.get<'swagger' | 'scalar'>('SWAGGER_TEMPLATE', 'swagger')

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .addGlobalParameters(
      {
        name: 'Accept-Language',
        in: 'header',
        description: '客户端语言',
        schema: { type: 'string', enum: languages, example: Language.ZH_CN },
      },
      {
        name: 'Timezone',
        in: 'header',
        description: '客户端时区',
        schema: {
          type: 'string',
          enum: [
            'Asia/Shanghai',
            'Asia/Hong_Kong',
            'America/New_York',
            'Etc/Universal',
          ],
          example: 'Asia/Shanghai',
        },
      },
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)

  if (template === 'swagger') {
    SwaggerModule.setup(path, app, document, {
      customSiteTitle: title,
    })
  }
  else {
    ScalarModule.setup(path, app, document, {
      title,
      description,
    })
  }
}
