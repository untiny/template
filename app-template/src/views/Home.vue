<template>
  <ion-page>
    <ion-header class="ion-no-border" translucent>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" fullscreen class="ion-padding">
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-4 col-span-4 row-span-1">
          <ion-input
            v-model="ip"
            placeholder="请输入IP地址"
            enterkeyhint="enter"
            fill="solid"
            inputmode="numeric"
            minlength="7"
            maxlength="15"
            type="text"
            mode="ios"
            style="
              --background: #f8f8f8;
              --border-radius: 0.75rem;
              --padding-start: 1rem;
              --padding-end: 1rem;
            "
          >
            <div slot="end">
              <ion-button size="small" @click="test">OK</ion-button>
            </div>
          </ion-input>
        </div>
        <div class="bg-white rounded-2xl p-4 col-span-2 row-span-2">
          <img :src="qrcode" class="w-full flex" />
        </div>
        <ion-button
          size="large"
          class="bg-white rounded-2xl col-span-2 row-span-1 m-0"
          mode="ios"
          color="tertiary"
        >
          <ion-icon slot="start" :icon="viteIcon"></ion-icon>
          <span>Untiny</span>
        </ion-button>
        <ion-button
          size="large"
          class="bg-white rounded-2xl col-span-2 row-span-1 m-0"
          mode="ios"
          color="warning"
        >
          <ion-icon slot="start" :icon="vueIcon"></ion-icon>
          <span>Untiny</span>
        </ion-button>
        <div class="bg-white rounded-2xl py-4 col-span-4">
          <ion-item lines="none" mode="ios">
            <ion-label>platform</ion-label>
            <ion-note slot="end">{{ platform }}</ion-note>
          </ion-item>
          <ion-item lines="none" mode="ios">
            <ion-label>Label</ion-label>
            <ion-note slot="end">Value</ion-note>
          </ion-item>
          <ion-item lines="none" mode="ios">
            <ion-label>Label</ion-label>
            <ion-note slot="end">Value</ion-note>
          </ion-item>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useQRCode } from "@vueuse/integrations/useQRCode";
import vueIcon from "@/assets/vue.svg";
import viteIcon from "@/assets/vite.svg";
import { Capacitor, CapacitorHttp } from "@capacitor/core";

const ip = ref("123");
const text = ref("text-to-encode");
const qrcode = useQRCode(text, { margin: 0 });

const platform = Capacitor.getPlatform();

const test = async () => {
  const res = await CapacitorHttp.get({
    url: "http://192.168.10.170:5173/",
  });
  console.log("什么滴家伙", JSON.stringify(res));
};
</script>
