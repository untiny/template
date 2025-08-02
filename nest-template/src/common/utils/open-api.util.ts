import { Logger } from '@nestjs/common'
import { OpenAPIObject } from '@nestjs/swagger'
import { has, set } from 'lodash'

type SchemaObject = NonNullable<NonNullable<OpenAPIObject['components']>['schemas']>[string] & {
  'x-enumDescriptions'?: Record<string, string>
}

export class OpenAPISchema {
  private static schemas: Map<string, SchemaObject> = new Map()

  static set(schemaName: string, schema: SchemaObject): void {
    this.schemas.set(schemaName, schema)
  }

  static get(schemaName: string): SchemaObject | undefined {
    return this.schemas.get(schemaName)
  }

  static buildDocument(document: OpenAPIObject): void {
    if (!document.components) {
      document.components = {}
    }
    if (!document.components.schemas) {
      document.components.schemas = {}
    }
    this.schemas.forEach((schema, name) => {
      if (has(document.components?.schemas, name)) {
        Logger.warn(`Schema with name "${name}" already exists. It will be overwritten.`, OpenAPISchema.name)
      }
      // eslint-disable-next-line ts/no-non-null-asserted-optional-chain
      set(document.components?.schemas!, name, schema)
    })
  }
}
