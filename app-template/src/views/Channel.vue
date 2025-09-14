<script lang="ts" setup>
import { arrowBackOutline } from 'ionicons/icons'

defineProps<{ channelId: string }>()
const count = ref(0)
onMounted(() => {
  setInterval(() => {
    count.value++
  }, 1000)
})
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border" translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-toggle>
            <ion-button>
              <ion-icon slot="icon-only" :icon="arrowBackOutline" />
            </ion-button>
          </ion-menu-toggle>
        </ion-buttons>
        <ion-title>{{ channelId }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" fullscreen class="ion-padding">
      <!--  -->
      <h1>Page A</h1>
      <p>Count: {{ count }}</p>
    </ion-content>
  </ion-page>
</template>
