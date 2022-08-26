import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from '@/ElementPlus/index' // 使用element-plus

import axios from '@/Axios/index' // 导入axios

const app = createApp(App).use(store).use(router)

app.config.globalProperties.$axios = axios

app.use(ElementPlus)

app.mount('#app')
