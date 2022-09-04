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
 *
 * @param {*} list  数组
 * @param {*} str 需要取得值
 * @param {*} value 嵌套的值
 * @returns  返回数组
 */

export const jointSinger = (list = [], str = 'singer', value) => {
  list.forEach((item) => {
    if (!value) {
      item[str] = forEachFilter(item.artists)
    } else {
      item[str] = forEachFilter(item[value].artists)
    }
  })
  return list
}
