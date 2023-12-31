// import store from '@/store/index.js'
// import useComputedCount from '@/hooks/useComputedCount'
/**
 *
 * @param {*} list  传入数组
 * @returns 返回拼接完全的数组
 */
export const jointSinger = (list = [], symbol = ' / ', params = 'name') => {
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
  if (num < 10) {
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
 * 转换时间 年月日
 * @param {*} t
 */
export const transformLocalTime = (t) => {
  return new Date(t).toLocaleDateString().replace(new RegExp('/', 'g'), '-')
}

export const computedCount = (count = 0) => {
  if (count >= 100000000) {
    return Math.trunc(count / 100000000) + '亿'
  } else if (count >= 100000) {
    return Math.trunc(count / 10000) + '万'
  } else {
    return count
  }
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
export const loopFilterAdd = ({
  musicList = [],
  str = 'singer',
  value, // 读取作者多层嵌套的名称
  artists = 'artists', // 默认读取作者的数组从artiasts中读取
  params = 'name', // 读取作者的名称
  symbol = '/',
  needIndex = false, // 是否需要添加索引 默认 index
  transTime = false, // 是否需要转换时间
  timeName = 'duration', // 转换时间的键名
  isTransPlayCount = false, // 是否转换播放总数
  readPlayCountName = 'playCount', // 需要读取对象中 playcount 具体名称
  setPlayCountName = '_playCount', //  设置成 名称
  addSingerAlias = false, // 是否添加别名, 需要的话只去第一个作者及别名
  transLocalTime = false // 转化发布时间
}) => {
  musicList.forEach((item, index) => {
    if (!value) {
      if (addSingerAlias) {
        item[str] = [item[artists].name, item[artists].alias[0]]
      } else {
        item[str] = jointSinger(item[artists] || item.ar, symbol, params)
      }
    } else {
      item[str] = jointSinger(item[value][artists], symbol, params)
    }
    if (needIndex) {
      item.index = fillNum(index + 1)
    }
    if (transTime) {
      // 时间兼容处理
      item.durationTime = transformTime(item[timeName] || item.dt)
    }
    if (isTransPlayCount) {
      item[setPlayCountName] = computedCount(item[readPlayCountName])
    }
    if (transLocalTime) {
      item._publishTime = transformLocalTime(item.publishTime)
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
}

/**
 *  存取数据
 * @param {*} tokenName 需要获取存储数据名
 * @param {*} isSet 是不是存数据
 * @param {*} isObj  是不是复杂数据类型 object array
 * @returns
 */
export const accessData = ({ dataName, isSet = false, dataType, data, placeholder /* 占位替代 */ }) => {
  if (isSet) {
    const res = judgeType(data)
    let packData = data
    if (res === 'array' || res === 'object') {
      packData = JSON.stringify(data)
    }
    localStorage.setItem(dataName, packData)
  } else {
    const argu = localStorage.getItem(dataName)
    const res = judgeType(argu)
    if (res) {
      if (dataType === 'array') {
        return placeholder || []
      } else if (dataType === 'object') {
        return placeholder || {}
      } else {
        return placeholder || ''
      }
    } else if (dataType === 'object' || dataType === 'array') {
      return JSON.parse(argu)
    } else {
      return argu
    }
  }
}

/**
 * 深度克隆数据  ，只拷贝数据，  使用json方法足以
 */
export const deepClone = (data) => {
  return JSON.parse(JSON.stringify(data))
}
