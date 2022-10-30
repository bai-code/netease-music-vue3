<template>
  <div class="show-mv-list" @click="playMv">
    <div class="show-img pointer">
      <img v-lazy="mvInfo.picUrl" alt="" />
      <div class="play-count">
        <i class="iconfont icon-play1"></i>
        {{ mvInfo.playCount }}
      </div>
      <div class="hover overflow">
        {{ mvInfo.copywriter }}
      </div>
    </div>
    <div class="show-mv-info">
      <p class="name">{{ mvInfo.name }}</p>
      <p class="author overflow pointer">{{ mvInfo.author }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  mvInfo: {
    type: Object,
    default: () => {
      return {
        picUrl: '',
        name: '',
        author: 'xx',
        playCount: ''
      }
    }
  }
})

const emits = defineEmits(['playMv'])

const playMv = () => {
  if (!props.mvInfo.name) return
  emits('playMv', props.mvInfo)
}
</script>

<style lang="less" scoped>
div.show-mv-list {
  div.show-img {
    position: relative;
    height: 120px;
    width: 100%;
    overflow: hidden;
    border-radius: 5px;
    font-size: 12px;
    &:hover div.hover {
      height: 30px;
    }
    &:hover div.play-count {
      opacity: 0;
    }
    img {
      height: inherit;
      width: inherit;
    }
    div.play-count {
      position: absolute;
      top: 0px;
      color: @contrastColor;
      width: 100%;
      padding: 5px 10px 5px 0;
      box-sizing: border-box;
      text-align: end;
      transition: all 0.3s 0.5s;
      background: linear-gradient(rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0) 100%);
      i.iconfont {
        font-size: 12px;
      }
    }
    div.hover {
      position: absolute;
      top: 0;
      width: 100%;
      color: @contrastColor;
      height: 0;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      padding-left: 15px;
      transition: height 0.3s 0.5s;
    }
  }
  div.show-mv-info {
    p {
      margin: 5px 0;
      font-size: 14px;
      &.name {
        .overflowMul(2);
      }
      &.author {
        font-size: 12px;
        color: @singerColor;
        &:hover {
          color: @fontColor;
        }
      }
    }
  }
}
</style>
