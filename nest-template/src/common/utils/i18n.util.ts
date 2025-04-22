import { ArgumentsHost } from '@nestjs/common'
import { I18nContext, Path, TranslateOptions } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n'

export function getI18nContext<K = I18nTranslations>(context?: ArgumentsHost): I18nContext<K> | undefined {
  return I18nContext.current<K>(context)
}

export function $t<K = I18nTranslations>(key: Path<K>, options?: TranslateOptions, context?: ArgumentsHost): string {
  const i18n = getI18nContext<K>(context)
  if (!i18n) {
    return key as string
  }
  return i18n.t(key, options)
}

export function $i18n<K = I18nTranslations>(key: Path<K>): Path<K> {
  return key
}

export function isI18nExceptionKey<K = I18nTranslations>(keyOrMessage: string): keyOrMessage is Path<K> {
  return keyOrMessage.startsWith('exception.')
}

export function i18nExceptionKey<K = I18nTranslations>(keyOrMessage: string): Path<K> {
  if (isI18nExceptionKey(keyOrMessage)) {
    return keyOrMessage as Path<K>
  }
  return `exception.${keyOrMessage}` as Path<K>
}

export function formatI18nException<K = I18nTranslations>(message: string, i18n: I18nContext<K>): string {
  if (!i18n) {
    return message
  }
  if (isI18nExceptionKey<K>(message)) {
    return i18n.t(message, {
      lang: i18n.lang,
      defaultValue: message,
    })
  }
  return i18n.t(i18nExceptionKey<K>(message), {
    lang: i18n.lang,
    defaultValue: message,
  })
}
