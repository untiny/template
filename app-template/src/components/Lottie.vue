<script setup lang="ts">
import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'

const props = defineProps<{ animationData?: any, assetsPath?: string }>()
const lottieContainer = ref<HTMLDivElement>()
const animation = ref<AnimationItem>()

function load() {
  if (!lottieContainer.value)
    return
  if (!props.animationData)
    return
  animation.value?.destroy()
  animation.value = lottie.loadAnimation({
    container: lottieContainer.value, // 容器
    renderer: 'canvas',
    loop: true,
    autoplay: true,
    animationData: props.animationData,
    assetsPath: props.assetsPath,
  })
  animation.value.play()
}

onMounted(() => {
  setTimeout(load)
})

onBeforeUnmount(() => {
  animation.value?.destroy()
})
</script>

<template>
  <div ref="lottieContainer" class="lottie w-32 h-32">
    <!-- lottie -->
  </div>
</template>
