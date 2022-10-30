<template>
  <div class="recommend-container">
    <div class="img pointer" @click="playVideo">
      <img v-if="recommendInfo.coverUrl || recommendInfo.cover" :src="recommendInfo.coverUrl || recommendInfo.cover" alt="" />
      <div class="play-count">
        <i class="iconfont icon-play1"></i>
        <span class="count">{{ recommendInfo._playCount }}</span>
      </div>
      <div class="play-time">{{ recommendInfo.durationTime }}</div>
    </div>
    <div class="info">
      <p class="description">{{ recommendInfo.title || recommendInfo.name }}</p>
      <p class="nickname overflow">{{ (recommendInfo.creator && recommendInfo.creator[0].userName) || recommendInfo.singer }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
// import { computedCount } from '@/utils/plugins.js'

const props = defineProps({
  recommendInfo: {
    type: Object
  },
  isMv: {
    type: Boolean,
    default: false
  }
})

// const playCount = computed(() => {
//   const count = props.recommendInfo.playTime
//   return computedCount(count)
//   // if (count > 100000000) {
//   //   return parseInt(count / 100000000) + '亿'
//   // } else if (count > 10000) {
//   //   return parseInt(count / 10000) + '万'
//   // } else {
//   //   return count
//   // }
// })

const router = useRouter()
const playVideo = () => {
  const { vid, id } = props.recommendInfo
  const query = {}
  if (vid) {
    query.vid = vid
  } else {
    query.mvid = id
  }
  router.push({ name: 'video-detail', query })
  // console.log(props.recommendInfo)
}
</script>
<style lang="less" scoped>
div.recommend-container {
  display: flex;
  height: 80px;
  margin-bottom: 20px;
  div.img {
    width: 140px;
    flex: 0 0 auto;
    position: relative;
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 30px;
      left: 0;
    }
    &::before {
      top: 0;
      background: linear-gradient(rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0) 100%);
    }
    &::after {
      bottom: 0;
      background: linear-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.4) 100%);
    }
    & > img {
      height: 100%;
      width: 100%;
      border-radius: 5px;
    }
    div.play-count,
    div.play-time {
      position: absolute;
      right: 5px;
      font-size: 12px;
      color: #eee;

      &.play-count {
        top: 5px;
        i.iconfont {
          font-size: 12px;
          margin-right: 5px;
        }
      }
      &.play-time {
        bottom: 5px;
      }
    }
  }
  div.info {
    width: calc(100% - 140px);
    flex: 0 0 auto;
    padding-left: 10px;
    box-sizing: border-box;
    .flex(space-between,flex-start);
    flex-direction: column;
    p.description {
      .overflowMul(2);
      font-size: 13px;
    }
    p.nickname {
      color: @singerColor;
      font-size: 12px;
      width: 100%;
    }
  }
}
</style>
