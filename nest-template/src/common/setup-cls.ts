import { ExecutionContext } from '@nestjs/common'
import acceptLanguage from 'accept-language'
import { isEnum } from 'class-validator'
import { Request } from 'express'
import { ClsService } from 'nestjs-cls'
import { Language, languages } from './enums/language.enum'

acceptLanguage.languages(languages)

export function setupCls(cls: ClsService, context: ExecutionContext) {
  const type = context.getType()
  if (type === 'http') {
    const request = context.switchToHttp().getRequest<Request>()
    if (request.headers) {
      const language = acceptLanguage.get(request.headers['accept-language']) as Language
      const timezone = request.headers.timezone as string ?? 'Asia/Shanghai'
      cls.set('timezone', timezone)
      if (isEnum(language, Language)) {
        cls.set('language', language)
      }
      else {
        cls.set('language', Language.ZH_CN)
      }
    }
  }
}
