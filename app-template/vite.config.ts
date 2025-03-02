import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { IonicResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv, PluginOption } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { PresetName } from "unplugin-auto-import/types";

// https://vite.dev/config/
export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), "VITE_");
  console.log({ env, ...config });

  const components = Components({
    resolvers: [IonicResolver()],
  });

  const autoImportPreset: PresetName[] = [
    "vue",
    "@vueuse/core",
    "vue-router",
    "pinia",
  ];

  const autoImport = AutoImport({
    imports: [
      ...autoImportPreset,
      {
        "@ionic/vue": [
          "useIonRouter",
          "onIonViewDidEnter",
          "onIonViewDidLeave",
          "onIonViewWillEnter",
          "onIonViewWillLeave",
          "loadingController",
          "alertController",
          "toastController",
          "actionSheetController",
          "modalController",
          "popoverController",
        ],
      },
    ],
    dirs: ["./src/stores/**", "./src/composables/**"],
  });

  const plugins: PluginOption[] = [
    vue(),
    components,
    autoImport,
    tailwindcss(),
  ];

  return {
    plugins,
    build: {
      assetsInlineLimit: 0, // 设置为0禁用将较小资源转 base64 编码
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "pinia", "vue-router"],
            vueuse: ["@vueuse/core"],
            ionic: ["@ionic/vue", "@ionic/vue-router"],
            lodash: ["lodash"],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // 设置为1000禁用 chunk 大小警告
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "::",
      port: 8080,
    },
  };
});
