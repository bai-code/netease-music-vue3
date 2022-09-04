import { createStore } from 'vuex'
import userinfo from './userInfo'
import $axios from '@/Axios/index.js'

export default createStore({
  state: {
    nickname: 211
  },
  mutations: {
    saveUserInfo(state, payload) {
      state.nickname += payload
    }
  },
  actions: {
    async getInfo(temp, { path }) {
      const res = await $axios.get(`${path}`)
      if (res.code === 200) {
        return res
      }
      return {}
    }
  },
  modules: {
    userinfo
  }
})
