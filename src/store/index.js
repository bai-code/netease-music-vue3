import { createStore } from 'vuex'
import userinfo from './userInfo'
import $axios from '@/Axios/index.js'
// import { transformTime } from '@/utils/plugins.js'
import { $audio } from '@/utils/audio.js'
import { transformTime } from '@/utils/plugins.js'
import comment from './comment.js'
import personalFm from './personal-fm'
import { ElMessage } from 'element-plus'
// import { ref } from 'vue'

// const timer = ref(null)

const info = localStorage.getItem('musicInfo')
// const isPlayFm = localStorage.getItem('isPlayFm') || false

const tempMusicInfo = {
  id: '',
  url: '',
  level: 'standard',
  singer: '',
  name: '',
  picUrl: '',
  durationTime: '',
  time: '', // 用于歌词部分会有时间超出，对比使用
  isFmMusic: false
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
    isPlay: false,
    isClick: false,
    currentPlayIndex: -1 // 当前播放歌曲索引
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
    // setDurationTime(state) {
    //   const { durationTime } = state
    //   const endTime = transformTime(Math.round(durationTime), false)
    //   if (/NaN/.test(endTime)) {
    //     return '88:88'
    //   } else {
    //     return endTime
    //   }
    // },
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
      // 用于foot 页面 是否有上一首下一首
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
          info[prop] = payload[prop] !== '' ? payload[prop] : info[prop]
        }
      }
      // console.log(info, payload.isFmMusic, judgeType(payload.isFmMusic))
      if (!payload.isFmMusic) {
        localStorage.setItem('musicInfo', JSON.stringify(info))
      }
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
    },
    // 歌曲进度跳转
    seekTime(state, { time }) {
      $audio.seekTime(time)
    },
    DOMClick(state, { flag }) {
      state.isClick = flag
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
    async getMusicInfo({ commit, state }, { musicInfo = {}, isPlay = true /* 默认播放 */, isNext = false, isFm = false }) {
      const { id, level = 'standard' } = musicInfo
      // console.log(id, musicInfo)
      if (!id) return
      const { code, data = [] } = await $axios.get(`/song/url/v1?id=${id}&level=${level}`)
      console.log(data, musicInfo)
      if (code === 200) {
        const { url } = data[0]
        if (!url) {
          if (!isNext) {
            let msg = ''
            switch (musicInfo.fee) {
              case 0:
                msg = '免费或无版权'
                break
              case 1:
                msg = 'VIP歌曲'
                break
              case 4:
                msg = '该专辑为付费专辑'
                break
              case 8:
                msg = '非会员可免费播放低音质，会员可播放高音质及下载'
                break
            }
            ElMessage({
              type: 'error',
              message: msg
            })
          }
          return false
        }
        const { time } = data[0]
        const durationTime = transformTime(time, true)
        // let oldTime = 0
        const newMusicInfo = Object.assign({}, musicInfo, { url, durationTime, time, isFmMusic: isFm })
        $audio.giveAddress(url, isPlay)
        // 状态改变再提交
        if (state.isPlay !== isPlay) {
          commit('changePlayStatus', { isPlay })
        }
        commit('savePlayMusicInfo', newMusicInfo)
        commit('saveUpdateTime', { durationTime: parseInt(data[0].time / 1000) })
        return true
      }
      // console.log('获取歌曲地址', data[0], id)
    },
    async changeMusic({ state, getters, dispatch }, { params = 'next' }) {
      const { musicList } = state
      let index = getters.findCurrentPageIndex(musicList)
      const len = musicList.length
      // console.log(index)
      // let flag = true

      const _get = async () => {
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
        if (!res) {
          ElMessage({
            type: 'error',
            message: '获取资源失败，自动下一首'
          })
          return _get()
        }
      }
      _get()
      // while (flag) {
      //   if (params === 'next') {
      //     if (index + 1 >= len) {
      //       index = 0
      //     } else {
      //       index += 1
      //     }
      //   } else {
      //     if (index - 1 < 0) {
      //       index = len - 1
      //     } else {
      //       index -= 1
      //     }
      //   }
      //   const res = await dispatch('getMusicInfo', { musicInfo: musicList[index], isNext: true })
      //   console.log('执行')
      //   if (res) {
      //     flag = false
      //   } else {
      //     ElMessage({
      //       type: 'error',
      //       message: '获取资源失败，自动下一首'
      //     })
      //   }
      // }
      // console.log('下一首', index + 1)
    }
  },
  modules: {
    userinfo,
    comment,
    personalFm
  }
})
export default store
