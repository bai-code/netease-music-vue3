import { createStore } from 'vuex'
import userinfo from './userInfo'

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
    userLogin() {
      console.log('2222222')
    }
  },
  modules: {
    userinfo
  }
})
