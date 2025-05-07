<script lang="ts" setup>
import { useRouteParams } from '@vueuse/router'

const operationId = useRouteParams('operationId')
</script>

<template>
  <div>
    <h1>{{ operationId }}</h1>
    <p>Welcome to the api operation page!</p>
  </div>
</template>
