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
        redirect: { name: 'recommendation' },
        component: () => import('../views/FindMusic/find-music.vue'),
        children: [
          {
            path: 'recommendation',
            name: 'recommendation',
            component: () => import('@/views/FindMusic/recommendation.vue')
          },
          {
            path: 'song-list',
            name: 'song-list',
            component: () => import('@/views/FindMusic/song-list')
          },
          {
            path: 'ranking-list',
            name: 'ranking-list',
            component: () => import('@/views/FindMusic/ranking-list')
          },
          {
            path: 'singer-list',
            name: 'singer-list',
            component: () => import('@/views/FindMusic/singer-list')
          },
          {
            path: 'latest-music',
            name: 'latest-music',
            component: () => import('@/views/FindMusic/latest-music')
          }
        ]
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
        path: 'video-list',
        name: 'video-list',
        component: () => import('@/views/Video/video-detail.vue')
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
      },
      {
        path: 'music-list/:id',
        name: 'music-list',
        component: () => import('@/views/Music-list/music-list.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
