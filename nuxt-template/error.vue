<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <h2>{{ error?.statusCode }}</h2>
    <button @click="handleError">
      清除错误
    </button>
  </div>
</template>
