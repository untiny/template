// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(),
  // 您的自定义配置在这里
  { rules: { 'nuxt/prefer-import-meta': 'error' } },
)
