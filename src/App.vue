<template>
  <div class="home-container">
    <router-view v-slot="{ Component }" name="nav">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <router-view v-slot="{ Component }" name="content">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <router-view v-slot="{ Component }" name="footer">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { onMounted, ref } from 'vue'
import audio from '@/utils/audio.js'

const oldTime = ref(null)
const store = useStore()

// 网易播放地址会过期，默认请求一次
const initMusicResource = () => {
  const { musicInfo } = store.state
  if (!musicInfo.id) return
  store.dispatch('getMusicInfo', { musicInfo, isPlay: false })
}

audio.addEventListener('timeupdate', function () {
  // 减少提交mutation
  const time = parseInt(this.currentTime)
  if (oldTime.value === time) return
  store.commit('saveUpdateTime', { currentTime: this.currentTime })
  oldTime.value = time
})

// 用于处理==》当用户进入fm页面，直接播放，浏览器机制，用户没点击之前不能播放
// 防止用户在fm页面刷新，产生报错问题
document.onclick = function () {
  store.commit('DOMClick', { isClick: true })
  document.onclick = null
}

onMounted(() => {
  initMusicResource()
})
</script>

<style lang="less">
div.home-container {
  width: 980px;
  height: 550px;
  .positions(20px,50%);
  font-size: 14px;
  color: @fontColor;
  box-shadow: 0 5px 10px @boxShadowColor, 5px 0 10px @boxShadowColor, 0 -5px 10px @boxShadowColor, -5px 0 10px @boxShadowColor;
  user-select: none;
}
//歌曲获取资源失败 弹窗类名
span.el-message-next {
  color: @blueColor;
  &:hover {
    text-decoration: underline;
  }
}
</style>
