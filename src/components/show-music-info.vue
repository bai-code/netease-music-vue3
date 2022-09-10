<template>
  <div class="show-item-info" :style="{ height: imgWH, width: imgWH }">
    <div class="image pointer" >
      <img v-lazy="musicInfo[showImgName]" alt="" />
      <div class="play-count" v-if="musicInfo.playCount">
        <i class="iconfont icon-play1"></i>
        <span>{{ showPlayCount }}</span>
      </div>
      <div class="play-hover" v-else>根据您的音乐口味生成每日更新</div>
      <div class="play-icon">
        <i class="iconfont icon-hover"></i>
      </div>
      <slot name="date-re"></slot>
    </div>
    <p class="description pointer">{{ musicInfo.name }}</p>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps({
  musicInfo: {
    type: Object,
    reqiured: true,
    default: () => {
      return {
        picUrl: '',
        name: '',
        playCount: ''
      }
    }
  },
  showImgName: {
    type: String,
    default: 'picUrl'
  },
  imgWH: {
    type: [String, Number],
    default: '200px',
    validator: (res) => {
      if (typeof res === 'number') {
        return res + 'px'
      }
      return res
    }
  }
})

const showPlayCount = computed(() => {
  const playCount = props.musicInfo.playCount
  if (playCount >= 100000000) {
    return Math.floor(playCount / 1000000000) + '亿'
  } else if (playCount >= 10000) {
    return Math.floor(playCount / 10000) + '万'
  }
  return playCount
})

</script>

<style lang="less" scoped>
div.show-item-info {
  // height: 240px;
  position: relative;
  width: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  div.image {
    flex: 0 0 auto;
    width: 100%;
    height: 100%;
    flex: 0 0 auto;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    &.source::after {
      bottom: 0;
      background: linear-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.3) 100%);
    }
    &:hover div.play-icon {
      opacity: 1;
    }
    &:hover div.play-hover {
      height: 55px;
      padding: 10px 5px;
    }
    img {
      height: 100%;
      width: 100%;
      // background: rgba(0 ,0 ,0,0.3);
      border-radius: 5px;
    }
    div.play-count {
      position: absolute;
      width: 100%;
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: flex-end;
      background: linear-gradient(rgba(0, 0, 0, 0.3) 0, rgba(0, 0, 0, 0) 100%);
      top: 0;
      left: 0;
      color: @contrastColor;
      font-size: 12px;
      padding: 0 5px 0;
      box-sizing: border-box;
      i {
        font-size: inherit;
        margin-right: 5px;
      }
    }
    div.play-hover {
      position: absolute;
      top: 0;
      left: 0;
      color: @contrastColor;
      font-size: 12px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.3);
      line-height: 18px;
      height: 0;
      overflow: hidden;
      padding: 0 5px;
      transition: all 0.4s 0.5s;
    }
    div.play-icon {
      position: absolute;
      opacity: 0;
      right: 8%;
      bottom: 8%;
      height: 24%;
      width: 24%;
      background: #fff;
      border-radius: 50%;
      .flex(center,center);
      transition: opacity 0.7s;
      & > i {
        color: @bgColor;
        font-size: 16px;
      }
    }
  }
  p.description {
    flex: 0 0 auto;
    .overflowMul(2);
    font-size: 13px;
    line-height: 18px;
    margin: 10px 0 20px;
  }
}
</style>
