import Introduction from '@/views/Introduction.vue'
import Operation from '@/views/Operation.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { name: 'Introduction', path: '/', component: Introduction },
  { name: 'Operation', path: '/operation/:operationId', component: Operation },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
