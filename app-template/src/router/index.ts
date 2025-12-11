import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'Chat' },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/ChatPage.vue'),
    children: [
      {
        path: ':channelId',
        props: true,
        name: 'Channel',
        component: () => import('@/views/Channel.vue'),
      },
      // {
      //   path: 'home',
      //   name: 'Home',
      //   component: () => import('@/views/Home.vue'),
      // },
      // {
      //   path: 'PageA',
      //   name: 'PageA',
      //   component: () => import('@/views/PageA.vue'),
      // },
      // {
      //   path: 'PageB',
      //   name: 'PageB',
      //   component: () => import('@/views/PageB.vue'),
      // },
      // {
      //   path: 'PageC',
      //   name: 'PageC',
      //   component: () => import('@/views/PageC.vue'),
      // },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
