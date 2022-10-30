import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home/Home.vue'
import Nav from '@/views/Home/home-nav.vue'
import Content from '@/views/Home/home-content.vue'
import Footer from '@/views/Home/home-footer.vue'

// const musicDetailContent = import('@/views/views-package/music-detail-content.vue')

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    components: { nav: Nav, content: Content, footer: Footer },
    redirect: { name: 'find-music' },
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
      // {
      //   path: 'video-list',
      //   name: 'video-list',
      //   component: () => import('@/views/Video/video-detail.vue')
      // },
      {
        path: 'attention',
        name: 'attention',
        component: () => import('@/views/Attention/attention.vue')
      },
      {
        path: 'personal-fm',
        name: 'personal-fm',
        component: () => import('@/views/PersonalFM/personal-fm.vue')
        // beforeEnter(to, from, next) {
        //   const userinfo = localStorage.getItem('userinfo')
        //   if (userinfo) {
        //     const { token } = JSON.parse(userinfo)
        //     if (!token) {
        //       next({ name: 'login' })
        //     } else {
        //       next()
        //     }
        //   }
        // }
      },
      {
        path: 'music-list/:id?',
        name: 'music-list',
        component: () => import('@/views/Music-list/music-list.vue')
      },
      {
        path: 'song-list-package/:pId', // 歌单 playlist  id
        name: 'song-list-package',
        component: () => import('@/views/Music-list/song-list-package.vue')
      },
      {
        path: 'song-list-package/:pId/link-userInfo/:userId',
        name: 'link-userInfo',
        component: () => import('@/views/Music-list/song-list-package/link-userInfo.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Login/login.vue')
      },
      {
        path: 'exclusive',
        name: 'exclusive',
        component: () => import('@/views/views-package/exclusive.vue')
      }
    ]
  },
  {
    path: '/video-detail',
    name: 'video-detail',
    components: { nav: Nav, content: () => import('@/views/Video/video-detail.vue') }
  },
  {
    path: '/music-detail',
    name: 'music-detail',
    components: { footer: Footer }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
