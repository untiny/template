import type { PresetName } from 'unplugin-auto-import/types'
import type { PluginOption } from 'vite'
import path from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), 'VITE_')
  console.log({ env, ...config })

  const components = Components({
    resolvers: [NaiveUiResolver()],
  })

  const autoImportPreset: PresetName[] = [
    'vue',
    '@vueuse/core',
    'vue-router',
    'pinia',
  ]

  const autoImport = AutoImport({
    imports: [
      ...autoImportPreset,
      {
        'naive-ui': [
          'useDialog',
          'useMessage',
          'useNotification',
          'useLoadingBar',
        ],
      },
    ],
    dirs: ['./src/stores/**', './src/composables/**'],
  })

  const plugins: PluginOption[] = [
    vue(),
    components,
    autoImport,
    tailwindcss(),
  ]

  return {
    plugins,
    build: {
      emptyOutDir: true,
      assetsInlineLimit: 0, // 设置为0禁用将较小资源转 base64 编码
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'pinia', 'vue-router'],
            vueuse: ['@vueuse/core'],
            lodash: ['lodash'],
            capacitor: ['@capacitor/core'],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // 设置为1000禁用 chunk 大小警告
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '::',
    },
  }
})
