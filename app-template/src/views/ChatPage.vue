<script setup lang="ts">
import { menuController } from '@ionic/vue'

async function onChat(i: number) {
  await menuController.open('chat')
}

const { width } = useWindowSize()

const chatMaxWidth = computed(() => width.value - 390)
</script>

<template>
  <ion-page>
    <ion-split-pane when="sm" content-id="main">
      <ion-page id="main">
        <ion-header class="ion-no-border" translucent>
          <ion-toolbar>
            <ion-searchbar mode="ios" class="!pb-0" />
          </ion-toolbar>
        </ion-header>
        <ion-content color="withe" fullscreen>
          <ion-list>
            <ion-item
              v-for="i in 10"
              :key="i" button lines="none"
              :router-link="`/chat/channel-${i}`"
              @click="onChat(i)"
            >
              <ion-avatar slot="start" class="w-13 h-13">
                <img alt="Silhouette of a person's head" src="/avatar.jpeg">
              </ion-avatar>
              <ion-label>
                <h2>Untiny</h2>
                <p>Are you ok?</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-page>

      <ion-menu
        side="end" menu-id="chat" content-id="main" style="--width: 100%;" :style="{
          '--side-max-width': `${chatMaxWidth}px`,
        }"
      >
        <ion-router-outlet />
      </ion-menu>
    </ion-split-pane>
  </ion-page>
</template>

<style lang="css">
ion-content::shadow::part(background)::before {
  content: "";
}
</style>
