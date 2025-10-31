import { join } from 'node:path'
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nOptions,
  I18nYamlLoader,
  QueryResolver,
} from 'nestjs-i18n'
import { isDev } from 'src/common/utils'

export function getI18nOptions(): I18nOptions {
  const options: I18nOptions = {
    loader: I18nYamlLoader,
    fallbackLanguage: 'zh',
    loaderOptions: {
      path: join(__dirname, '..', 'i18n'), // 使用相对路径
    },
    resolvers: [
      { use: QueryResolver, options: ['lang'] },
      { use: HeaderResolver, options: ['lang'] },
      { use: CookieResolver, options: ['lang'] },
      AcceptLanguageResolver,
    ],
  }

  if (isDev) {
    options.logging = true
    options.loaderOptions.watch = true
    options.typesOutputPath = join('src', 'generated', 'i18n', 'index.ts')
  }

  return options
}
