// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/devtools',
    '@nuxtjs/tailwindcss',
  ],
  imports: {
    autoImport: true,
  },
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  compatibilityDate: '2025-05-15',
})
