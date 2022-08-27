// import { createStore } from 'vuex'
import $axios from '@/Axios/index.js'
import avatarUrl from '@/static/temp-avatar.png'

const userinfo = JSON.parse(localStorage.getItem('userinfo'))

const userInfo = userinfo || {
  avatarUrl,
  nickname: '未登录',
  token: ''
}

export default {
  namespaced: true,
  state: {
    userInfo
  },
  mutations: {
    // 存储对象
    saveInfo(state, userinfo) {
      state.userInfo = userinfo
      localStorage.setItem('userinfo', JSON.stringify(userinfo))
    }
  },
  actions: {
    async userLogin({ state, commit }, { phone, password }) {
      const { token, profile } = await $axios.get(`/login/cellphone?phone=${phone}&password=${password}`)
      if (token) {
        const { avatarUrl, nickname } = profile
        commit('saveInfo', { token, avatarUrl, nickname })
        return true
      }
      // commit('saveInfo', userInfo)
      return false

      // console.log(avatarUrl, nickname)
    },
    async userLogout() {
      const res = await $axios.get('/logout')
      console.log(res)
    }
  }
}
