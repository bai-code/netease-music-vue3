// callback  统一作为请求数据的回调函数
// import { transformTime } from '@/utils/plugins.js'

const audio = new Audio()
audio.autoplay = false
// let isError = false

export const $audio = {
  async playMusic() {
    // if (!audio.src) {
    //   audio.src = url
    // }
    // audio.addEventListener('canplaythrough', function () {
    audio.play()
    // console.log('开始播放')
    // })
  },
  pauseMusic() {
    // if (isError) return
    audio.pause()
  },
  // async prevMusic(callback) {
  //   ;(await callback) && callback()
  //   this.playMusic()
  // },
  // async nextMusic(callback) {
  //   ;(await callback) && callback()
  //   this.playMusic()
  // },
  giveAddress(url, isPlay) {
    audio.src = url
    if (isPlay) {
      this.playMusic()
    }
  }
  // async getMusicUrl(callback) {
  //   ;(await callback) && callback()
  //   this.playMusic()
  // }
}

// audio.addEventListener('canplay', function () {
//   // $audio.playMusic()
//   console.log('准备就绪')
// })

// window.audio = audio
export default audio

// audio.addEventListener('timeupdate', function (callback) {})
