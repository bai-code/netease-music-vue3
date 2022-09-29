/**
 *
 * @param {*} list  传入数组
 * @returns 返回拼接完全的数组
 */
export const forEachFilter = (list = [], symbol = '/') => {
  if (list.length === 0) return ''
  const len = list.length
  if (len === 1) {
    return list[0].name
  } else {
    let singer = ''
    list.map((item, index) => {
      if (index === len - 1) {
        singer += item.name
      } else {
        singer += item.name + symbol
      }
    })
    return singer
  }
}

/**
 *  填充数字
 * @param { * } num 需要填充的数字
 * @returns
 */
export const fillNum = (num) => {
  if (typeof num === 'number' && num < 10) {
    return String(num).padStart(2, '0')
  }
  return num
}
/**
 *  完成填充数字
 * @param {*} t 需要变换的时间
 * @param {*} isMs 是否是毫秒
 * @returns  返回时间格式
 */
export const transformTime = (t, isMs = true) => {
  let time = t
  if (isMs) {
    time = t / 1000
  }
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${fillNum(m)} : ${fillNum(s)}`
}

/**
 *
 * @param {*} list  数组
 * @param {*} str 需要取得值
 * @param {*} value 嵌套的值
 * @param {*} needIndex 是否需要索引
 * @param {*} transTime 是否需要转换时间
 * @returns  返回数组
 */
export const jointSinger = ({ musicList = [], str = 'singer', value, needIndex = false, transTime = false, artists = 'artists' }) => {
  musicList.forEach((item, index) => {
    if (!value) {
      item[str] = forEachFilter(item[artists])
    } else {
      item[str] = forEachFilter(item[value][artists])
    }
    if (needIndex) {
      item.index = fillNum(index + 1)
    }
    if (transTime) {
      item.durationTime = transformTime(item.duration)
    }
  })
  return musicList
}

/**
 * 返回所需的信息
 * @param {*} info 需求的数据
 */
export const returnNeedInfo = (info = {}) => {
  const { id, singer, name, picUrl } = info
  return {
    id,
    singer,
    name,
    picUrl
  }
}

// index   musicInfo 二选一
export const playAndCommit = ({ store, musicList = [], /* 传递的数组 */ index /*  当前播放索引 */, musicInfo }) => {
  if (index === 0 || index) {
    store.dispatch('getMusicInfo', { musicInfo: musicList[index] })
  } else {
    store.dispatch('getMusicInfo', { musicInfo })
  }
  store.commit('saveMusicList', { musicList })
  console.log('提交并播放', musicList[index])
}
