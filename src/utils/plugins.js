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

export const fillNum = (num) => {
  if (typeof num === 'number' && num < 10) {
    return String(num).padStart(2, '0')
  }
  return num
}

const transitionTime = (t, isMs = true /* 是否是毫秒 */) => {
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
 * @param {*} isIndex 是否需要索引
 * @returns  返回数组
 */
export const jointSinger = (list = [], str = 'singer', value, needIndex = false, transTime = false) => {
  list.forEach((item, index) => {
    if (!value) {
      item[str] = forEachFilter(item.artists)
    } else {
      item[str] = forEachFilter(item[value].artists)
    }
    if (needIndex) {
      item.index = fillNum(index + 1)
    }
    if (transTime) {
      item.durationTime = transitionTime(item.duration)
    }
  })
  return list
}
