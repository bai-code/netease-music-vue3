import { createStore } from 'vuex'
import userinfo from './userInfo'
import $axios from '@/Axios/index.js'
import { $audio } from '@/utils/audio.js'
import { transformTime, deepClone, accessData } from '@/utils/plugins.js'
import comment from './comment.js'
import personalFm from './personal-fm'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const timer = ref(null)
const count = ref(3)

const info = JSON.parse(localStorage.getItem('musicInfo'))
// const info = accessData({dataName:'musicInfo',dataType:'object', placeholder:{}})

const tempMusicInfo = {
  id: '',
  url: '',
  singer: '',
  name: '',
  picUrl: '',
  durationTime: '',
  time: '', // 用于歌词部分会有时间超出，对比使用
  isFmMusic: false, // 是否是Fm 页面歌曲
  privilege: {}, // 展示音质等级
  fee: ''
}
const musicInfo = Object.assign({}, tempMusicInfo, info)

const list = localStorage.getItem('musicList')
const musicList = (list && JSON.parse(list)) || []
const _level = accessData({ dataName: '_level', placeholder: 'standard' })
const loopStatus = accessData({ dataName: 'loopStatus', placeholder: 'listLoop' })

const store = createStore({
  state: {
    musicInfo,
    musicList,
    currentTime: 0, // 播放到哪
    precentage: 0, // 进度条
    durationTime: 100,
    isPlay: false, // 播放状态
    isClick: false, // fm页面，防止未点击直接播放=》导致无效
    currentPlayIndex: -1, // 当前播放歌曲索引,
    _level, // 播放音质
    loopStatus, // 循环状态 single(单曲) singleCycle（单循）  list（列表）  listLoop（列循） random （随机）
    tempMusicList: deepClone(musicList), // 缓存数据，用于缓存随机播放列表
    countDown: 3 // 三秒倒计时
  },
  getters: {
    // 返回总时长百分比
    setPrecentage(state) {
      const { currentTime, durationTime } = state
      const precentage = currentTime / durationTime
      return isNaN(precentage) ? 0 : precentage
    },
    // 设置footer进度条时间
    setCurrentTime(state) {
      const { currentTime } = state
      const startTime = transformTime(Math.round(currentTime), false)
      if (/NaN/.test(startTime)) {
        return '00:00'
      } else {
        return startTime
      }
    },
    findCurrentPageIndex(state) {
      // 计算当前页面是否存在播放的歌曲 添加类名
      return function (list = []) {
        const { id } = state.musicInfo
        const index = list.findIndex((item) => {
          return item.id === id
        })
        const referList = JSON.stringify(state.musicList)
        const currentList = JSON.stringify(list)
        if (referList === currentList) {
          return index
        }
        return -1
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
      const { musicList, isClean, tempMusicList, isDeepClone, isSaveMusicList = true } = payload
      if (tempMusicList) {
        // 只是单纯保存tempMusicList
        state.tempMusicList = isDeepClone ? deepClone(musicList) : tempMusicList
      }
      if (!isSaveMusicList) return
      localStorage.setItem('musicList', JSON.stringify(musicList))
      state.musicList = musicList
      if (isClean) {
        state.musicInfo = tempMusicInfo
        localStorage.setItem('musiciInfo', JSON.stringify({}))
      }
    },
    saveUpdateTime(state, payload) {
      const { durationTime, currentTime } = payload
      if (durationTime) {
        state.durationTime = durationTime
      }
      state.currentTime = currentTime
    },
    changePlayStatus(state, { isPlay }) {
      // 单纯改变播放状态
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
      state.currentTime = time // 解决拖动播放进度条拖动，抖动问题
      $audio.seekTime(time)
    },
    DOMClick(state, { flag }) {
      state.isClick = flag
    },
    // 改变播放音质
    changeQuality(state, payload) {
      const { level } = payload
      state._level = level
      localStorage.setItem('_level', level)
      // accessData({ tokenName: 'level', isSet: true, data: level })
    },
    // 改变循环方式
    changeLoopStatus(state, { loopStatus }) {
      state.loopStatus = loopStatus
      accessData({ dataName: 'loopStatus', isSet: true, data: loopStatus })
    },
    cloneMusicList(state, { musicList }) {
      state.tempMusicList = deepClone(musicList)
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
    /**
     *
     * @param {isFm} 是不是播放fm页面
     * @param {mp3Url} 部分数据中自带url
     * @param {isNext} 对于下一首，不用这里处理
     * @returns
     */
    async getMusicInfo({ commit, state }, { musicInfo = {}, isPlay = true /* 默认播放 */, isNext = false, isFm = false, level }) {
      const { id } = musicInfo
      const _level = level || state._level
      // console.log(id, musicInfo)
      if (!id) return
      const { code, data = [] } = await $axios.get(`/song/url/v1?id=${id}&level=${_level}`)

      // console.log(data, musicInfo, level, state.level)
      if (code === 200) {
        const { url, level } = data[0]
        if (!url) {
          if (!isNext) {
            let msg = ''
            switch (musicInfo.fee) {
              case 0:
                msg = '获取资源失败---无版权'
                break
              case 1:
                msg = '获取资源失败---VIP歌曲'
                break
              case 4:
                msg = '获取资源失败---该专辑为付费专辑'
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
        const newMusicInfo = Object.assign({}, musicInfo, { url, durationTime, time, isFmMusic: isFm })
        $audio.giveAddress(url, isPlay)
        // 状态改变再提交
        if (state.isPlay !== isPlay) {
          commit('changePlayStatus', { isPlay })
        }
        const _le = level || _level // 如果选择最高，部分歌曲不支持，所以从请求结果中获取
        if (state._level !== _le) {
          commit('changeQuality', { level: _le })
        }
        commit('savePlayMusicInfo', newMusicInfo)
        commit('saveUpdateTime', { durationTime: parseInt(data[0].time / 1000) })

        return true
      }
      // console.log('获取歌曲地址', data[0])
    },
    async changeMusic({ state, getters, commit, dispatch }, { params = 'next' }) {
      const { musicList, loopStatus, tempMusicList } = state
      let index = 0
      let useRequestList = musicList // 默认使用musicList
      if (loopStatus !== 'random') {
        index = getters.findCurrentPageIndex(musicList)
      }
      const len = musicList.length
      const _get = async () => {
        if (params === 'next') {
          index += 1
        } else {
          if (index - 1 < 0) {
            index = len - 1
          } else {
            index -= 1
          }
        }
        if (loopStatus === 'single') {
          // 单曲播放
          commit('changePlayStatus', { isPlay: false }) // 播放结束默认pause(),所以只用改变状态就好
          return
        } else if (loopStatus === 'singleCycle') {
          // 单曲循环
          commit('seekTime', { time: 0 })
          commit('play', { isPlay: true })
          return
        } else if (loopStatus === 'list' && index === len) {
          commit('changePlayStatus', { isPlay: false })
          return
        } else if (loopStatus === 'listLoop' && index >= len) {
          index = 0
        } else if (loopStatus === 'random') {
          const _len = tempMusicList.length
          index = parseInt(Math.random() * _len)
          useRequestList = tempMusicList
        }

        const res = await dispatch('getMusicInfo', { musicInfo: useRequestList[index], isNext: true })
        if (loopStatus === 'random') {
          useRequestList.splice(index, 1)
          // 当使用的数组 删完，重新克隆一次
          commit('saveMusicList', { tempMusicList: useRequestList, isDeepClone: useRequestList.length === 0, musicList, isSaveMusicList: false })
        }
        if (!res) {
          commit('pause')
          ElMessage({
            type: 'warning',
            message: '<p>获取资源失败，稍后自动下一首',
            duration: 3000,
            dangerouslyUseHTMLString: true
          })
          timer.value = setInterval(() => {
            count.value -= 1
            if (count.value <= 0) {
              clearInterval(timer.value)
              _get()
            }
            console.log(count.value)
          }, 1000)

          // timeoutTimer.value = setTimeout(() => {
          //   clearTimeout(timeoutTimer.value)
          //   _get()
          // }, 3000)
        }
      }
      _get()
    }
  },
  modules: {
    userinfo,
    comment,
    personalFm
  }
})
export default store
