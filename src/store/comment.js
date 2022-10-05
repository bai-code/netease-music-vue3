import axios from '@/Axios/index.js'

export default {
  namespaced: true,
  actions: {
    async submitComment(temp, { commentId, content, type, id }) {
      let str = ''

      if (commentId) {
        str += `?t=2&commentId=${commentId}`
      } else {
        str += '?t=1'
      }
      str += `&type=${type}&id=${id}&content=${content}`
      console.log(str)
      const { code, message, data } = await axios.get(`/comment?${str}`)
      return {
        code,
        message,
        data
      }
    }
  }
}
