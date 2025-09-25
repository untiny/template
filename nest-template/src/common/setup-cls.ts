import { ExecutionContext } from '@nestjs/common'
import acceptLanguage from 'accept-language'
import { FastifyRequest } from 'fastify'
import { ClsService } from 'nestjs-cls'
import { Language, languages } from './enums/language.enum'
import { getI18nContext } from './utils'

acceptLanguage.languages(languages)

export function setupCls(cls: ClsService, context: ExecutionContext) {
  const type = context.getType()
  const i18n = getI18nContext(context)
  const language = i18n?.lang as Language | undefined
  cls.set('language', language ?? Language.ZH)
  if (type === 'http') {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    if (request.headers) {
      const timezone = (request.headers.timezone as string) ?? 'Asia/Shanghai'
      cls.set('timezone', timezone)
    }
  }
}
