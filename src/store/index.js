import { createStore } from 'vuex'
import userinfo from './userInfo'
import $axios from '@/Axios/index.js'

const audio = new Audio()

export default createStore({
  state: {
    musicInfo: {
      url: '',
      level: 'exhigh',
      md5: ''
    }
  },
  mutations: {
    saveMusicInfo(state, playload) {
      const temp = state.musicInfo
      for (const prop in playload) {
        temp[prop] = playload[prop]
      }
    },
    addAudioAttr(state, playload) {
      for (const prop in playload) {
        audio[prop] = playload[prop]
      }
    },
    play() {
      audio.play()
    },
    pause() {
      audio.pause()
    }
  },
  actions: {
    async getInfo(temp, { path }) {
      const res = await $axios.get(`${path}`)
      if (res.code === 200) {
        return res
      }
      return {}
    },
    async getMusicInfo({ commit }, { id, level = 'standard' /* 默认标准音质 */ }) {
      const { code, data = [] } = await $axios.get(`/song/url/v1?id=${id}&level=${level}`)
      if (code === 200) {
        const { url, md5, level } = data[0]
        commit('saveMusicInfo', { url, md5, level })
        commit('addAudioAttr', { src: url })
        commit('play')
      }
      console.log(data)
    }
  },
  modules: {
    userinfo
  }
})
