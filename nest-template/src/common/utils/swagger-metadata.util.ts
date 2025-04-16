import { ApiPropertyOptions } from '@nestjs/swagger'
import { PropertyOptions } from '../decorators'
import { Language } from '../enums/language.enum'

export function getApiPropertyOptions(
  target: object,
  property: string,
): ApiPropertyOptions | undefined {
  return Reflect.getMetadata('swagger/apiModelProperties', target, property)
}

export function getPropertyTitle(
  target: object,
  property: string,
  language: Language = Language.ZH_CN,
) {
  const propertyOptions = getApiPropertyOptions(target, property) as PropertyOptions
  if (!propertyOptions) {
    return null
  }
  const title = propertyOptions['x-i18n-title']?.[language] ?? propertyOptions.title as string
  return title
}
