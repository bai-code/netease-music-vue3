import { createStore } from 'vuex'
import userinfo from './userInfo'
import $axios from '@/Axios/index.js'
// import { transformTime } from '@/utils/plugins.js'
import { $audio } from '@/utils/audio.js'
import { transformTime } from '@/utils/plugins.js'
import comment from './comment.js'
import { ElMessage } from 'element-plus'

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
    durationTime: 100,
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
      const startTime = transformTime(Math.round(currentTime), false)
      if (/NaN/.test(startTime)) {
        return '00:00'
      } else {
        return startTime
      }
    },
    setDurationTime(state) {
      const { durationTime } = state
      return transformTime(Math.round(durationTime), false)
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
          info[prop] = (payload.album && payload.album.picUrl) || (payload.ar && payload.al.picUrl) || (payload.al && payload.al.picUrl) || payload.picUrl || info[prop]
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
      if (durationTime) {
        state.durationTime = durationTime
      }
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
      // console.log(res)
      if (res && res.code === 200) {
        return res
      }
      return {}
    },
    async getMusicInfo({ commit }, { musicInfo = {}, isPlay = true /* 默认播放 */, isNext = false }) {
      const { id, level = 'standard' } = musicInfo
      // console.log(id, musicInfo)
      if (!id) return
      const { code, data = [] } = await $axios.get(`/song/url/v1?id=${id}&level=${level}`)
      if (code === 200) {
        const { url } = data[0]
        if (!url) {
          if (!isNext) {
            ElMessage({
              type: 'error',
              message: '获取歌曲资源失败'
            })
          }
          return false
        }
        const durationTime = transformTime(data[0].time, true)
        // let oldTime = 0
        const newMusicInfo = Object.assign({}, musicInfo, { url, durationTime })
        $audio.giveAddress(url, isPlay)
        commit('changePlayStatus', { isPlay })
        commit('savePlayMusicInfo', newMusicInfo)
        commit('saveUpdateTime', { durationTime: parseInt(data[0].time / 1000) })
        return true
      }
      // console.log('获取歌曲地址', data[0], id)
      // console.log(data[0])
    },
    async changeMusic({ state, getters, dispatch }, { params = 'next' }) {
      const { musicList } = state
      let index = getters.findCurrentPageIndex(musicList)
      const len = musicList.length
      // console.log(index)
      let flag = true

      while (flag) {
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
        const res = await dispatch('getMusicInfo', { musicInfo: musicList[index], isNext: true })
        if (res) {
          flag = false
        } else {
          ElMessage({
            type: 'error',
            message: '获取资源失败，自动下一首'
          })
        }
      }
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
