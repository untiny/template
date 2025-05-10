import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  ignores: [
    'android',
    'ios',
    'harmony',
    'harmonyos',
  ],
  rules: {
    'no-console': 'warn',
  },
})
