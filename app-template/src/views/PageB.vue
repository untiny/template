<script lang="ts" setup>
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
          <ion-back-button/>
        </ion-buttons>
        <ion-title>Page B</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="withe" fullscreen class="ion-padding">
      <!--  -->
      <h1>Page B</h1>
      <p>Count: {{ count }}</p>
    </ion-content>
  </ion-page>
</template>
