import { ApiPropertyOptions } from '@nestjs/swagger'

export function getApiPropertyOptions(
  target: object,
  property: string,
): ApiPropertyOptions | undefined {
  return Reflect.getMetadata('swagger/apiModelProperties', target, property)
}
