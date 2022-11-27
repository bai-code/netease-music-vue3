import { computed } from 'vue'

export default function (count = 0) {
  return computed(() => {
    if (count >= 100000000) {
      return Math.trunc(count / 100000000) + '亿'
    } else if (count >= 100000) {
      return Math.trunc(count / 10000) + '万'
    } else {
      return count
    }
  })
}
