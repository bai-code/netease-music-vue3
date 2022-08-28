import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: { name: 'podcast' },
    children: [
      {
        path: 'find-music',
        name: 'find-music',
        component: () => import('../views/FindMusic/find-music.vue')
      },
      {
        path: 'podcast',
        name: 'podcast',
        component: () => import('../views/Podcast/podcast.vue')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/Video/video.vue')
      },
      {
        path: 'attention',
        name: 'attention',
        component: () => import('@/views/Attention/attention.vue')
      },
      {
        path: 'personal-fm',
        name: 'personal-fm',
        component: () => import('@/views/PersonalFM/personal-fm.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
