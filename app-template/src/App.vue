<script setup lang="ts">
import { App } from '@capacitor/app'
import { useBackButton } from '@ionic/vue'

const router = useIonRouter()
useBackButton(-1, () => {
  if (!router.canGoBack()) {
    App.exitApp()
  }
})
</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
