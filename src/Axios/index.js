import axios from 'axios'

const instance = axios.create({
  baseURL: '/',
  timeout: 20000
})

instance.interceptors.request.use((config) => {
  return config
})

instance.interceptors.response.use((res) => {
  return res
})

export default instance
