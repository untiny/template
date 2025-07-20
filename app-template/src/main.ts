import { Capacitor } from '@capacitor/core'
import { IonicVue } from '@ionic/vue'
import { SafeArea } from '@untiny/capacitor-safe-area'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@ionic/vue/css/core.css'
import '@ionic/vue/css/display.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/typography.css'
import './style.css'

async function injectSafeAreaVariables() {
  if (!Capacitor.isNativePlatform()) {
    return
  }
  const safeArea = await SafeArea.getSafeArea()
  Object.entries(safeArea).forEach(([key, value]) => {
    document.documentElement.style.setProperty(
      `--ion-safe-area-${key}`,
      `${value}px`,
    )
  })
}

async function bootstrap() {
  await injectSafeAreaVariables()

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(IonicVue, { mode: 'md' })
  app.use(router)

  await router.isReady()

  app.mount('#app')
}
bootstrap()
