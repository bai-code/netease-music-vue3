// import { createStore } from 'vuex'
import $axios from '@/Axios/index.js'
import avatarUrl from '@/static/temp-avatar.png'

const userinfo = JSON.parse(localStorage.getItem('userinfo'))

const tempUserInfo = {
  avatarUrl,
  nickname: '未登录',
  token: '',
  userId: ''
}

const userInfo = userinfo || tempUserInfo

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
    async userLogin({ commit }, { phone, password }) {
      const { token, profile } = await $axios.get(`/login/cellphone?phone=${phone}&password=${password}`)
      if (token) {
        const { avatarUrl, nickname, userId } = profile
        commit('saveInfo', { token, avatarUrl, nickname, userId })
        return true
      }
      // commit('saveInfo', userInfo)
      return false

      // console.log(avatarUrl, nickname)
    },
    async userLogout({ commit }) {
      const { code } = await $axios.get('/logout')
      if (code === 200) {
        commit('saveInfo', tempUserInfo)
      }
      return code === 200
    }
  }
}
