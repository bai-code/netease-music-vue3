// import { playAndCommit } from "../utils/plugins";

import store from '@/store/index.js'
import { loopFilterAdd } from './plugins'

export const playAndCommit = async ({ musicList = [], /* 传递的数组 */ index /*  当前播放索引 */, musicInfo, isPlay = true, isFm = false, level }) => {
  let flag = false
  if (index === 0 || index) {
    flag = await store.dispatch('getMusicInfo', { musicInfo: musicList[index], isFm, level })
  } else {
    flag = await store.dispatch('getMusicInfo', { musicInfo, isPlay, isFm, level })
  }
  if (!isFm && musicList.length > 0) {
    store.commit('saveMusicList', { musicList, tempMusicList: [], isDeepClone: true })
  }
  return flag
}

/**
 * 用于show-music-info组件，直接点击播放按钮
 * @param {id}  歌单列表 id
 * @param {path}  个别请求路径
 * @param {isPlay}  自动播放
 */
export const getPlaylist = async ({ id, path, isPlay = false }) => {
  let list = []
  if (!id) {
    const { data, code } = await store.dispatch('getInfo', { path: '/recommend/songs' })
    if (code === 200) {
      list = loopFilterAdd({ musicList: data.dailySongs, artists: 'ar', transTime: true })
    }
  } else {
    const p = path || `/playlist/track/all?id=${id}`
    const { songs } = await store.dispatch('getInfo', { path: p })
    list = loopFilterAdd({ musicList: songs, artists: 'ar', transTime: true, timeName: 'dt' })
  }
  if (isPlay) {
    playAndCommit({ musicList: list, index: 0 })
  }
  return list
}
