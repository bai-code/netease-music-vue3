import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000
})

instance.interceptors.request.use((config) => {
  return config
})

instance.interceptors.response.use(
  (res) => {
    if (res.status === 200) {
      return res.data
    }
    return {}
  },
  (err) => {
    console.log(err)
  }
)

export default instance
