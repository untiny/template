import { UnionToEnum } from '../types'
import { OpenAPISchema } from '../utils'

export const Language: UnionToEnum<Language> = {
  EN: 'en',
  ZH: 'zh',
} as const

export const languages = Object.values(Language) as Language[]

OpenAPISchema.set('LanguageEnum', {
  'type': 'string',
  'enum': languages,
  'example': Language.ZH,
  'x-enumDescriptions': {
    [Language.ZH]: '简体中文',
    [Language.EN]: '英语',
  },
})
