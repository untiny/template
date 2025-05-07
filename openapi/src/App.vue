<script setup lang="ts">
import type { OpenAPI } from '@scalar/openapi-types'
import type { GlobalTheme, MenuGroupOption, MenuInst, MenuOption } from 'naive-ui'
import { Search } from '@vicons/carbon'
import { isEmpty } from 'lodash'
import { NEllipsis } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { useSwagger } from './store/use-swagger'

const { document, isReady } = useSwagger('http://local-dev.58mhg.com:3090/api-docs-json')

const theme = ref<GlobalTheme | null>(null)

const keyword = ref<string>('')

function renderLabel(option: MenuOption | MenuGroupOption | OperationMenuOption) {
  const classes = [
    'ml-3',
    'font-mono',
    'font-medium',
    'ms-auto',
    'text-xs',
    'text-nowrap',
  ]

  const methodClasses: Record<Lowercase<OpenAPI.HttpMethod>, string> = {
    get: 'text-green-600 dark:text-green-400',
    delete: 'text-red-600 dark:text-red-400',
    head: 'text-gray-600 dark:text-gray-400',
    options: 'text-orange-600 dark:text-orange-400',
    patch: 'text-purple-600 dark:text-purple-400',
    post: 'text-blue-600 dark:text-blue-400',
    put: 'text-yellow-600 dark:text-yellow-400',
    trace: 'text-cyan-600 dark:text-cyan-400',
  }

  if (option.method) {
    classes.push(methodClasses[option.method as Lowercase<OpenAPI.HttpMethod>])
  }

  const label = h(
    NEllipsis,
    null,
    { default: () => option.label as string },
  )
  const method = option.method
    ? h(
        'div',
        { class: classes.join(' ') },
        String(option.method).toLocaleUpperCase(),
      )
    : null
  const div = h(
    'div',
    { class: 'flex items-center justify-between' },
    [label, method],
  )
  if (!option.key?.toString().startsWith('/')) {
    return div
  }
  return h(
    RouterLink,
    { to: { path: option.key as string } },
    { default: () => div },
  )
}

type OperationMenuOption = MenuOption & {
  label?: string
  method?: string
  path?: string
  tags?: string[]
  href?: string
}

const operations = computed(() => {
  const options: OperationMenuOption[] = []
  for (const path in document.value?.paths) {
    const pathItem = document.value?.paths[path]
    Object.entries(pathItem!).forEach(([method, operation]) => {
      options.push({
        label: operation.summary ?? path,
        method,
        path,
        tags: operation.tags,
        key: `/operation/${operation.operationId}`,
      })
    })
  }
  return options
})

const menuOptions = computed(() => {
  if (!isEmpty(keyword.value)) {
    return operations.value.filter((operation) => {
      return operation.label?.includes(keyword.value) || operation.path?.includes(keyword.value)
    })
  }
  const options: MenuOption[] = [
    {
      label: 'Introduction',
      key: '/',
    },
  ]
  const tagGroups: Map<string, OperationMenuOption[]> = new Map()
  operations.value.forEach((operation) => {
    operation.tags?.forEach((tag) => {
      if (!tagGroups.has(tag)) {
        tagGroups.set(tag, [])
      }
      tagGroups.get(tag)?.push(operation)
    })
  })
  tagGroups.forEach((operations, tag) => {
    options.push({
      label: tag,
      key: tag,
      children: operations,
    })
  })
  return options
})

const selectedKeyRef = ref<string>(window.location.hash?.replace('#', '') || '/')
const menuInstRef = ref<MenuInst | null>(null)

watch(isReady, async () => {
  await nextTick()
  menuInstRef.value?.showOption(selectedKeyRef.value)
})
</script>

<template>
  <n-config-provider :theme="theme">
    <n-layout has-sider position="absolute">
      <n-layout-sider bordered>
        <div class="p-4">
          <n-input v-model:value="keyword" type="text" placeholder="Search..." clearable>
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
        </div>
        <n-menu
          ref="menuInstRef"
          v-model:value="selectedKeyRef"
          class="select-none"
          :options="menuOptions"
          :indent="16"
          :render-label="renderLabel"
        />
      </n-layout-sider>
      <n-layout-content content-class="p-8">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>

</style>
