<script setup lang="ts">
import type { OpenAPI } from '@scalar/openapi-types'
import type { GlobalTheme, MenuGroupOption, MenuOption } from 'naive-ui'
import { Search } from '@vicons/carbon'
import { processDocument } from './utils/process-document'

const theme = ref<GlobalTheme | null>(null)

const keyword = ref<string>('')

function renderExtra(option: MenuOption | MenuGroupOption) {
  const classes = [
    'font-mono',
    'font-medium',
    'ms-auto',
    'text-xs',
    'text-nowrap',
  ]
  if (option.extra === 'POST') {
    classes.push('text-blue-600', 'dark:text-blue-400')
  }
  else if (option.extra === 'DELETE') {
    classes.push('text-red-600', 'dark:text-red-400')
  }
  else if (option.extra === 'PUT') {
    classes.push('text-yellow-600', 'dark:text-yellow-400')
  }
  else if (option.extra === 'GET') {
    classes.push('text-green-600', 'dark:text-green-400')
  }
  else if (option.extra === 'PATCH') {
    classes.push('text-purple-600', 'dark:text-purple-400')
  }
  else if (option.extra === 'HEAD') {
    classes.push('text-gray-600', 'dark:text-gray-400')
  }
  else if (option.extra === 'OPTIONS') {
    classes.push('text-orange-600', 'dark:text-orange-400')
  }
  else if (option.extra === 'CONNECT') {
    classes.push('text-pink-600', 'dark:text-pink-400')
  }
  else if (option.extra === 'TRACE') {
    classes.push('text-cyan-600', 'dark:text-cyan-400')
  }
  else {
    classes.push('text-gray-600', 'dark:text-gray-400')
  }
  return h(
    'span',
    { class: classes.join(' ') },
    option.extra,
  )
}

function handleUpdateValue(key: string, item: MenuOption) {
  console.log(key, item)
}

const document = ref<OpenAPI.Document>()

onMounted(async () => {
  const result = await processDocument('http://local-dev.58mhg.com:3090/api-docs-json')
  document.value = result.document
  console.log(result.document)

  // const options = result.document.tags?
})

const menuOptions: MenuOption[] = [
  { label: 'Introduction', key: 'introduction' },
  {
    label: '用户管理',
    key: 'users',
    children: [
      {
        label: '创建用户',
        key: 'createUser',
        extra: 'POST',
      },
      {
        label: '获取用户列表',
        key: 'getUsers',
        extra: 'GET',
      },
      {
        label: '删除用户',
        key: 'deleteUser',
        extra: 'DELETE',
      },
    ],
  },
]
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
        <n-menu class="select-none" :options="menuOptions" :indent="16" default-value="introduction" :render-extra="renderExtra" @update:value="handleUpdateValue" />
      </n-layout-sider>
      <n-layout-content content-class="p-8">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>

</style>
