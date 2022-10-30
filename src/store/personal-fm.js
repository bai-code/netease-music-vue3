import { ref } from 'vue'
import axios from '@/Axios/index.js'
import { loopFilterAdd } from '@/utils/plugins.js'

const offset = ref(0) // 偏移量

export default {
  namespaced: true,
  state: {
    personalFmList: []
  },
  mutations: {
    changeFmList(state, { method, list }) {
      if (method === 'shift') {
        state.personalFmList.shift()
      }
      state.personalFmList.push(...list)
    }
  },
  actions: {
    async getFm({ state, commit, rootState }, payload = {}) {
      const { data = [] } = await axios.get(`/personal_fm?offset=${offset.value}`)
      const { isPlay } = payload
      if (isPlay && rootState.isPlay !== isPlay) {
        commit('play', null, { root: true })
      }
      if (data.length) {
        const { personalFmList } = state
        const packageData = loopFilterAdd({ musicList: data })
        if (personalFmList.length > 2) {
          commit('changeFmList', { method: 'shift', list: packageData })
          // personalFmList.shift()
        } else {
          commit('changeFmList', { method: 'push', list: packageData })
          // personalFmList.push(...packageData)
        }
      }
      offset.value += 1
    }
  }
}
