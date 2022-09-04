import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import LazyLoad from 'lazy-load-vue3'

import '@/utils/normalize.css' // 重置样式

import '@/utils/iconfont/iconfont.css' // 图标样式

import ElementPlus from '@/ElementPlus/index' // 使用element-plus

import axios from '@/Axios/index' // 导入axios

import tempPng from '@/static/temp.jpeg'
import loading from '@/static/loading.gif'

const app = createApp(App).use(store).use(router)

app.config.globalProperties.$axios = axios

app.use(ElementPlus)

app.use(LazyLoad, {
  loading,
  error: tempPng
})

app.mount('#app')
