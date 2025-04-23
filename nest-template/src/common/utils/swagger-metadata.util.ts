import { ApiPropertyOptions } from '@nestjs/swagger'
import { PropertyOptions } from '../decorators'
import { Language } from '../enums/language.enum'
import { $t } from './i18n.util'

export function getApiPropertyOptions(
  target: object,
  property: string,
): ApiPropertyOptions | undefined {
  return Reflect.getMetadata('swagger/apiModelProperties', target, property)
}

export function getPropertyTitle(
  target: object,
  property: string,
  language: Language = Language.ZH,
) {
  const propertyOptions = getApiPropertyOptions(target, property) as PropertyOptions
  if (!propertyOptions || !propertyOptions?.i18n) {
    return propertyOptions?.title ?? null
  }
  return $t(propertyOptions.i18n, {
    lang: language,
    defaultValue: propertyOptions.title ?? propertyOptions.i18n,
  })
}
