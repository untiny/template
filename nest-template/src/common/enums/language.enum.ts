import { UnionToEnum } from '../types'

export const Language: UnionToEnum<Language> = {
  EN_US: 'en-US',
  ZH_CN: 'zh-CN',
} as const

export const languages = Object.values(Language) as Language[]
