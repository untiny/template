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
    <ion-content fullscreen style="--background: url('/bg.png'), url('/bg-color.png') center center/cover repeat;">
      <!--  -->

      <ion-list style="--ion-item-background: transparent">
        <ion-item
          v-for="i in 100"
          :key="i" button lines="none"
        >
          <ion-avatar :slot="i % 2 ? 'start' : 'end'" class="w-9.5 h-9.5" style="--border-radius: 0.5rem">
            <img alt="Silhouette of a person's head" src="/avatar.jpeg">
          </ion-avatar>
          <ion-label>
            <!-- <h3>Untiny</h3> -->
            <div class="bg-white py-2 px-4 rounded-lg w-fit line-height-loose " :class="i % 2 ? 'mr-auto' : 'ml-auto'">
              <p>Are you OK?</p>
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
