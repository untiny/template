import { UnionToEnum } from '../types'

export const Language: UnionToEnum<Language> = {
  EN: 'en',
  ZH: 'zh',
} as const

export const languages = Object.values(Language) as Language[]
