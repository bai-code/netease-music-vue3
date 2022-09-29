<template>
  <router-view />
</template>

<script setup>
// import { provide, ref } from 'vue'
// import { useStore } from 'vuex'
// import { transformTime } from '@/utils/plugins.js'

// const store = useStore()
// const audio = new Audio()
// const isFirst = ref(true)

// const $audio = {
//   async playMusic(callback) {
//     if (this.listenError()) return
//     if (isFirst.value) {
//       ;(await callback) && callback()
//       // isFirst = false
//       return
//     }
//     audio.play()
//     console.log('开始播放', audio.src)
//   },
//   pauseMusic() {
//     // if (isError) return
//     audio.pause()
//   },
//   async prevMusic(callback) {
//     ;(await callback) && callback()
//     this.playMusic()
//   },
//   async nextMusic(callback) {
//     ;(await callback) && callback()
//     this.playMusic()
//   },
//   giveAddress(url) {
//     audio.src = url
//     console.log('赋予地址')
//     this.playMusic()
//   },
//   async getMusicUrl(callback) {
//     ;(await callback) && callback()
//     this.playMusic()
//   },
//   listenTimeupdate(callback) {
//     // 监听播放进度
//     audio.addEventListener('timeupdate', function () {
//       callback && callback(this.currentTime)
//     })
//   },
//   listenEnded(callback) {
//     audio.onended = () => {
//       this.nextMusic(callback)
//     }
//   },
//   listenError(callback) {
//     let flag = false
//     audio.onerror = async () => {
//       // 只处理第一次错误，多次可能是请求服务器问题，不再处理

//       ;(await callback) && callback()

//       console.log('错误')
//       flag = true
//     }
//     return flag
//   }
// }

// audio.addEventListener('timeupdate', function () {
//   const precentage = transformTime(Math.round(this.currentTime / this.duration), false)
//   store.dispatch('savePlayMusicInfo', { updateTime: this.currentTime, precentage })
// })

// audio.addEventListener('error', function () {
//   console.log('报错')
// })

// audio.addEventListener('ended', function () {
//   console.log('播放结束')
// })

// audio.addEventListener('canplay', function () {
//   console.log('可以播放')
//   isFirst.value = false
// })

// provide('$audio', $audio)
</script>

<style>
body {
  font-size: 14px;
}
</style>
