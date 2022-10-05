import { createStore } from 'vuex'
import userinfo from './userInfo'
import $axios from '@/Axios/index.js'
// import { transformTime } from '@/utils/plugins.js'
import audio, { $audio } from '@/utils/audio.js'
import { transformTime } from '@/utils/plugins.js'
import comment from './comment.js'

const info = localStorage.getItem('musicInfo')
const tempMusicInfo = {
  id: '',
  url: '',
  level: 'standard',
  singer: '',
  name: '',
  picUrl: '',
  durationTime: ''
}
const musicInfo = Object.assign({}, tempMusicInfo, (info && JSON.parse(info)) || {})

const list = localStorage.getItem('musicList')
const musicList = (list && JSON.parse(list)) || []

const store = createStore({
  state: {
    musicInfo,
    musicList,
    currentTime: 0, // 播放到哪
    precentage: 0, // 进度条
    isPlay: false
  },
  getters: {
    setPrecentage(state) {
      const { currentTime, durationTime } = state
      const precentage = Math.round((currentTime / durationTime) * 100)
      if (isNaN(precentage)) {
        return 0
      }
      return precentage
    },
    setCurrentTime(state) {
      const { currentTime } = state
      return transformTime(Math.round(currentTime), false)
    },
    findCurrentPageIndex(state) {
      // 计算当前页面是否存在播放的歌曲 添加类名
      return function (list = []) {
        const { id } = state.musicInfo
        return list.findIndex((item) => {
          return item.id === id
        })
      }
    },
    isNotChange(state) {
      const { musicList } = state
      if (musicList.length === 0) {
        return true
      } else {
        return false
      }
    }
  },

  mutations: {
    savePlayMusicInfo(state, payload) {
      const info = state.musicInfo
      for (const prop in info) {
        if (prop === 'picUrl') {
          info[prop] = (payload.album && payload.album.picUrl) || (payload.ar && payload.al.picUrl) || info[prop]
        } else {
          info[prop] = payload[prop] || info[prop]
        }
      }
      localStorage.setItem('musicInfo', JSON.stringify(info), false)
    },
    // 保存播放列表
    saveMusicList(state, payload) {
      const { musicList } = payload
      localStorage.setItem('musicList', JSON.stringify(musicList))
      state.musicList = musicList
    },
    saveUpdateTime(state, payload) {
      const { durationTime, currentTime } = payload
      state.durationTime = durationTime
      state.currentTime = currentTime
    },
    changePlayStatus(state, { isPlay }) {
      state.isPlay = isPlay
    },
    play(state) {
      $audio.playMusic()
      state.isPlay = true
    },
    pause(state) {
      $audio.pauseMusic()
      state.isPlay = false
    }
  },
  actions: {
    async getInfo(temp, { path }) {
      const res = await $axios.get(`${path}`)
      console.log(res)
      if (res && res.code === 200) {
        return res
      }
      return {}
    },
    async getMusicInfo({ commit }, { musicInfo = {}, isPlay = true /* 默认播放 */ }) {
      const { id, level = 'standard' } = musicInfo
      // console.log(id, musicInfo)
      if (!id) return
      const { code, data = [] } = await $axios.get(`/song/url/v1?id=${id}&level=${level}`)
      if (code === 200) {
        const { url } = data[0]
        let oldTime = 0
        const newMusicInfo = Object.assign({}, musicInfo, { url })
        $audio.giveAddress(url, isPlay)
        commit('changePlayStatus', { isPlay })
        commit('savePlayMusicInfo', newMusicInfo)
        audio.addEventListener('timeupdate', function () {
          // 减少提交mutation
          const time = parseInt(this.currentTime)
          if (oldTime === time) return
          commit('saveUpdateTime', { currentTime: this.currentTime, durationTime: this.duration })
          oldTime = time
        })
      }
      // console.log('获取歌曲地址', data[0], id)
      // console.log(data)
    },
    changeMusic({ state, getters, dispatch }, { params = 'next' }) {
      const { musicList } = state
      let index = getters.findCurrentPageIndex(musicList)
      const len = musicList.length
      // console.log(index)
      if (params === 'next') {
        if (index + 1 >= len) {
          index = 0
        } else {
          index += 1
        }
      } else {
        if (index - 1 < 0) {
          index = len - 1
        } else {
          index -= 1
        }
      }
      dispatch('getMusicInfo', { musicInfo: musicList[index] })
      // console.log('下一首', index + 1)
    }
  },
  modules: {
    userinfo,
    comment
  }
})

// console.log(store.state, isFirstEnter)

export default store
