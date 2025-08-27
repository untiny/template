import { Logger } from '@nestjs/common'
import { OpenAPIObject } from '@nestjs/swagger'
import { has, set } from 'lodash'

type SchemaObject = NonNullable<NonNullable<OpenAPIObject['components']>['schemas']>[string] & {
  'x-enumDescriptions'?: Record<string, string>
}

export class OpenAPISchema {
  private static schemas: Map<string, SchemaObject> = new Map()

  static set(schemaName: string, schema: SchemaObject): void {
    OpenAPISchema.schemas.set(schemaName, schema)
  }

  static get(schemaName: string): SchemaObject | undefined {
    return OpenAPISchema.schemas.get(schemaName)
  }

  static buildDocument(document: OpenAPIObject): void {
    if (!document.components) {
      document.components = {}
    }
    if (!document.components.schemas) {
      document.components.schemas = {}
    }
    OpenAPISchema.schemas.forEach((schema, name) => {
      if (has(document.components?.schemas, name)) {
        Logger.warn(`Schema with name "${name}" already exists. It will be overwritten.`, OpenAPISchema.name)
      }
      set(document.components?.schemas as Record<string, SchemaObject>, name, schema)
    })
  }
}
