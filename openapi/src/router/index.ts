import Introduction from '@/views/Introduction.vue'
import Operation from '@/views/Operation.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: Introduction },
  { path: '/operation/:path+', component: Operation },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
