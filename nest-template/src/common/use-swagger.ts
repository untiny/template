import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { OpenAPIObject } from '@nestjs/swagger'
import { DocumentBuilder, getSchemaPath, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import type { Request, Response } from 'express'
import { Env } from 'src/generated/env'
import { OpenAPISchema } from './utils'

OpenAPISchema.set('TimezoneEnum', {
  type: 'string',
  enum: ['Asia/Shanghai', 'Asia/Hong_Kong', 'America/New_York', 'Etc/Universal'],
  example: 'Asia/Shanghai',
  'x-enumDescriptions': {
    'Asia/Shanghai': '[上海时间](https://utctime.info/timezone/Asia--Shanghai/)',
    'Asia/Hong_Kong': '[香港时间](https://utctime.info/timezone/Asia--Hong_Kong/)',
    'America/New_York': '[纽约时间](https://utctime.info/timezone/America--New_York/)',
    'Etc/Universal': '[通用时区](https://utctime.info/timezone/Etc--Universal/)',
  },
})

class ScalarModule {
  static setup(
    path: string,
    app: INestApplication,
    document: OpenAPIObject,
    metaData?: { title?: string; description?: string },
  ) {
    app.use(`/${path}-json`, (_req: Request, res: Response) => {
      res.type('application/json')
      res.send(document)
    })

    app.use(
      `/${path}`,
      apiReference({
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
        persistAuth: true,
        defaultOpenAllTags: false,
      }),
    )
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
        schema: {
          $ref: getSchemaPath('LanguageEnum'),
        },
      },
      {
        name: 'Timezone',
        in: 'header',
        description: '客户端时区',
        schema: {
          $ref: getSchemaPath('TimezoneEnum'),
        },
      },
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)

  OpenAPISchema.buildDocument(document)

  if (template === 'swagger') {
    SwaggerModule.setup(path, app, document, {
      customSiteTitle: title,
    })
  } else {
    ScalarModule.setup(path, app, document, {
      title,
      description,
    })
  }
}
