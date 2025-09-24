<script lang="ts" setup>
import { arrowBackOutline } from 'ionicons/icons'
import AstronautJSON from '@/assets/qlottie/2/6/6.json'

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
    <ion-content fullscreen style="--background: url('/bg.png'), url('/bg-color.png') center center/cover repeat;">
      <!--  -->
      <lottie
        v-for="i in 2"
        :key="i"
        :animation-data="AstronautJSON"
      />
      <ion-list style="--ion-item-background: transparent">
        <ion-item
          v-for="i in 10"
          :key="i" button lines="none"
        >
          <ion-avatar :slot="i % 2 ? 'start' : 'end'" class="w-10 h-10" style="--border-radius: 0.5rem">
            <img alt="Silhouette of a person's head" src="/avatar.jpeg">
          </ion-avatar>
          <ion-label>
            <!-- <h3>Untiny</h3> -->
            <div class="bg-white px-4 rounded-lg w-fit leading-10 " :class="i % 2 ? 'mr-auto' : 'ml-auto'">
              Are you OK? <img width="16" src="/apng/s311.png" alt="">
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer class="ion-no-border" translucent>
      <ion-toolbar>
        <ion-title>{{ channelId }}</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
