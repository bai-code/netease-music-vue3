/**
 *
 * @param {*} list  传入数组
 * @returns 返回拼接完全的数组
 */
export const forEachFilter = (list = [], symbol = '/', params = 'name') => {
  if (list.length === 0) return ''
  const len = list.length
  if (len === 1) {
    return list[0][params]
  } else {
    let singer = ''
    list.map((item, index) => {
      if (index === len - 1) {
        singer += item[params]
      } else {
        singer += item[params] + symbol
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
  return `${fillNum(m)}:${fillNum(s)}`
}

/**
 *
 * @param {*} list  数组
 * @param {*} str 需要取得值
 * @param {*} value 嵌套的值
 * @param {*} needIndex 是否需要索引
 * @param {*} transTime 是否需要转换时间
 * @param {*} params
 *
 * @returns  返回数组
 */
export const jointSinger = ({ musicList = [], str = 'singer', value, needIndex = false, transTime = false, artists = 'artists', params = 'name', timeName = 'duration' }) => {
  musicList.forEach((item, index) => {
    if (!value) {
      item[str] = forEachFilter(item[artists], '', params)
    } else {
      item[str] = forEachFilter(item[value][artists], '', params)
    }
    if (needIndex) {
      item.index = fillNum(index + 1)
    }
    if (transTime) {
      item.durationTime = transformTime(item[timeName])
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
export const playAndCommit = async ({ store, musicList = [], /* 传递的数组 */ index /*  当前播放索引 */, musicInfo, isPlay = true, isFm = false }) => {
  let flag = false
  if (index === 0 || index) {
    flag = await store.dispatch('getMusicInfo', { musicInfo: musicList[index], isFm })
  } else {
    flag = await store.dispatch('getMusicInfo', { musicInfo, isPlay, isFm })
  }
  if (!isFm && musicList.length > 0) {
    store.commit('saveMusicList', { musicList })
  }
  return flag
}

export const computedCount = (count = 0) => {
  if (count / 100000000 >= 1) {
    return parseInt(count / 100000000) + '亿'
  } else if (count / 10000 >= 1) {
    return parseInt(count / 10000) + '万'
  } else {
    return count
  }
}
/**
 * query  遍历对象需要匹配的某个属性
 * @param {*} param0 匹配的值
 * @returns 返回索引
 */
export const findItemIndex = ({ musicList = [], query = 'name', params }) => {
  return musicList.findIndex((item) => {
    return item[query] === params
  })
}

// 判断数据类型
export const judgeType = (params) => {
  return Object.prototype.toString.call(params).slice(8, -1).toLowerCase()
}

/**
 * query   需要匹配对象的某个属性【array / string】
 * @param {*} param0 匹配相等的值
 *         params='name'  嵌套后要取的值
 * @returns
 */
export const filterMusicList = ({ musicList = [], query, params, params1 = 'name' }) => {
  return musicList.filter((item) => {
    if (judgeType(query) === 'array') {
      return query.some((prop) => {
        if (prop === 'al') {
          return new RegExp(params, 'i').test(item[prop][params1])
        }
        return new RegExp(params, 'i').test(item[prop])
      })
    } else {
      return new RegExp(params, 'i').test(item[query])
    }
  })
  // console.log(judgeType('sfsdf'), musicList, params, query)
  // return musicList.filter((item) => {

  // })
}
