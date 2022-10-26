// callback  统一作为请求数据的回调函数
// import { transformTime } from '@/utils/plugins.js'
const audio = new Audio()
// const volume = audio.volume
let volumeCount = 0
// let timerStart = null
let timerEnd = null

audio.onerror = function () {
  console.log('error')
}
// audio.load()

audio.autoplay = false
// let isError = false
export const $audio = {
  async playMusic() {
    // if (!audio.src) {
    //   audio.src = url
    // }
    // audio.addEventListener('canplaythrough', function () {

    // audio.volume = 0
    // console.log(audio.paused)
    if (audio.paused) {
      // audio.oncanplay = () => {
      audio.play()
      // }
    }
    // timerStart = setInterval(() => {
    //   console.log(volume, volumeCount)
    //   if (volume >= volumeCount || volumeCount >= 1) {
    //     clearInterval(timerStart)
    //     timerStart = null
    //     volumeCount = volume
    //   }
    //   volumeCount += 0.1
    //   audio.volume = volumeCount >= 1 ? 1 : volumeCount
    // }, 60)
  },
  pauseMusic() {
    timerEnd = setInterval(() => {
      if (volumeCount <= 0.1) {
        clearInterval(timerEnd)
        timerEnd = null
        audio.pause()
        volumeCount = 0
      } else {
        audio.volume = volumeCount -= 0.1
      }
    }, 30)
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
    // console.log(url)
    audio.src = url
    if (isPlay) {
      this.playMusic()
    }
  },
  seekTime(time) {
    audio.currentTime = time
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
