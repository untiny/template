/// <reference types="@capacitor/keyboard" />
import type { CapacitorConfig } from '@capacitor/cli'
import { KeyboardResize } from '@capacitor/keyboard'

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'app-template',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    Keyboard: {
      resizeOnFullScreen: false,
      resize: KeyboardResize.None,
    },
  },
  server: {
    androidScheme: 'http',
  },
}

export default config
