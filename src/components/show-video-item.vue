<template>
  <div class="video-container show-video pointer show-video-item">
    <div class="img" @mouseenter="isHover = true" @mouseleave="isHover = false" @click="playVideo">
      <img class="imageFill" :src="tempImgUrl" alt="" lazy />
      <span class="show-icon" v-show="showIcon" key="icon">
        <i class="iconfont icon-hover"></i>
      </span>
      <div class="play-count">
        <i class="iconfont icon-play1"></i>
        <span class="count">{{ filterTime }}</span>
      </div>
      <div class="count-time">{{ videoInfo.data.countTime }}</div>
    </div>
    <p class="video-name overflow">{{ videoInfo.data.title || videoInfo.data.name }}</p>
    <p class="author overflow">{{ (videoInfo.data.artists && videoInfo.data.artists[0].name) || videoInfo.data.creator.nickname }}</p>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, watch, defineEmits } from 'vue'
import { computedCount } from '@/utils/plugins'

const props = defineProps({
  videoInfo: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['playVideo'])

const filterTime = computed(() => {
  const praisedCount = props.videoInfo.data && props.videoInfo.data.praisedCount
  // if (praisedCount > 100000000) {
  //   return parseInt(praisedCount / 100000000) + '亿'
  // } else if (praisedCount > 100000) {
  //   return parseInt(praisedCount / 100000) + '万'
  // } else {
  //   return praisedCount
  // }
  return computedCount(praisedCount)
})

const showIcon = ref(false)
const timer = ref(null)
const tempImgUrl = ref(null)
const isHover = ref(false)

// 用于切换tag 时，图片被复用问题
watch(
  () => props.videoInfo,
  () => {
    tempImgUrl.value = props.videoInfo.data.coverUrl
  },
  { immediate: true, deep: true }
)

// hover效果
watch(
  isHover,
  (newValue) => {
    if (newValue) {
      if (props.videoInfo.data.previewDurationms) {
        tempImgUrl.value = props.videoInfo.data.previewUrl
        timer.value = setTimeout(() => {
          showIcon.value = true
        }, props.videoInfo.data.previewDurationms + 100)
      } else {
        clearTimeout(timer.value)
        timer.value = null
        showIcon.value = true
      }
    } else {
      clearTimeout(timer.value)
      timer.value = null
      showIcon.value = false
      tempImgUrl.value = props.videoInfo.data.coverUrl
    }
  },
  {
    immediate: true
  }
)

const playVideo = () => {
  emits('playVideo', props.videoInfo)
}
</script>

<style lang="less" scoped>
div.video-container {
  display: flex;
  min-height: 180px;
  width: 100%;
  border-radius: 5px;
  flex-direction: column;
  font-size: 12px;
  color: #fff;
  text-shadow: 0 0 5px #ccc;
  margin-top: 10px;
  div.img {
    height: 135px;
    width: 240px;
    flex: 0 0 auto;
    overflow: hidden;
    position: relative;
    border-radius: 5px;
    background: #ccc;
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      height: 30px;
      width: 100%;
    }
    &::before {
      top: 0;
      background: linear-gradient(rgba(0, 0, 0, 0.3) 0, rgba(0, 0, 0, 0) 100%);
    }
    &::after {
      bottom: 0;
      background: linear-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.4) 100%);
    }
    span.show-icon {
      .positions(50%,50%);
      height: 35px;
      width: 35px;
      background: #fff;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      .flex(center,center);
      & > i.iconfont {
        color: @bgColor;
        font-size: 20px;
      }
    }
    div.play-count {
      position: absolute;
      right: 10px;
      top: 5px;
      i.iconfont {
        font-size: 12px;
        margin-right: 5px;
      }
    }
    div.count-time {
      position: absolute;
      right: 10px;
      bottom: 5px;
    }
  }
  p.video-name,
  p.author {
    flex: 0 0 auto;
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    color: @singerColor;
  }
  p.video-name {
    color: @fontColor;
  }
}
</style>
