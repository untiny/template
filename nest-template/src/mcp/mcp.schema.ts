import { ZodObject } from 'zod'

export interface ZodSchema<TSchema extends ZodObject = ZodObject> {
  new (): ReturnType<TSchema['parse']>
  schema: TSchema
}

export function createZodSchema<T extends ZodObject>(schema: T): ZodSchema<T> {
  class SchemaClass {
    public static readonly schema = schema
  }

  return SchemaClass as unknown as ZodSchema<T>
}
