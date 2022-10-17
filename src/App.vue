<template>
  <div class="home-container">
    <!-- <keep-alive>
      <div class="container">
        <router-view name="nav"></router-view>
        <router-view name="content"></router-view>
        <router-view name="footer" />
      </div>
    </keep-alive> -->

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

const initMusicResource = () => {
  const { musicInfo } = store.state
  if (!musicInfo.id) return
  store.dispatch('getMusicInfo', { musicInfo, isPlay: false })
}

audio.addEventListener('ended', function () {
  store.dispatch('changeMusic', { params: 'next' })
})

audio.addEventListener('timeupdate', function () {
  // 减少提交mutation
  const time = parseInt(this.currentTime)
  if (oldTime.value === time) return
  store.commit('saveUpdateTime', { currentTime: this.currentTime })
  oldTime.value = time
})

onMounted(() => {
  initMusicResource()
})

// initMusicResource()
</script>

<style lang="less">
div.home-container {
  width:980px;
  height: 550px;
  .positions(20px,50%);
  font-size: 14px;
  color: @fontColor;
  box-shadow: 0 5px 10px @boxShadowColor, 5px 0 10px @boxShadowColor, 0 -5px 10px @boxShadowColor, -5px 0 10px @boxShadowColor;
}
</style>
