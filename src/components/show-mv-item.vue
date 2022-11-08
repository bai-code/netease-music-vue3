<template>
  <div class="show-mv-item" @click="playMv">
    <div class="show-img pointer">
      <el-image class="imageFill" :src="mvInfo.picUrl || mvInfo.cover || mvInfo.imgurl" alt="" lazy>
        <template #placeholder>
          <img class="temp imageFill" src="~@/static/loading.gif" alt="" />
        </template>
        <template #error>
          <img class="temp imageFill" src="~@/static/error.webp" alt="" />
        </template>
      </el-image>
      <div :class="[{ needHover: needHover }, 'play-count']">
        <i class="iconfont icon-play1"></i>
        {{ mvInfo._playCount || mvInfo.playCount }}
      </div>
      <slot name="hover">
        <div :class="[{ needHover: needHover }, 'overflow', 'hover']">
          {{ mvInfo.copywriter }}
        </div>
      </slot>
    </div>
    <div class="show-mv-info">
      <p class="name" :class="{ overflow: textOverflow }"
      :title="mvInfo.name">{{ mvInfo.name }}</p>
      <p class="author overflow pointer" v-if="mvInfo.author">{{ mvInfo.author }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

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
  },
  needHover: {
    // 是否需要hover效果
    type: Boolean,
    default: false
  },
  textOverflow: {
    type: Boolean,
    default: false
  }
})

// const emits = defineEmits(['playMv'])

const router = useRouter()
const playMv = () => {
  const { id } = props.mvInfo
  if (!id) return
  router.push({ name: 'video-detail', query: { mvid: id } })
  // console.log(props.mvInfo, router)
  // emits('playMv', props.mvInfo)
}
</script>

<style lang="less" scoped>
div.show-mv-item {
  margin-bottom: 20px;
  div.show-img {
    position: relative;
    height: 130px;
    width: 240px;
    overflow: hidden;
    border-radius: 5px;
    font-size: 12px;
    &:hover div.hover.needHover {
      height: 30px;
    }
    &:hover div.play-count.needHover {
      opacity: 0;
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
    width: 240px;
    p {
      margin: 5px 0;
      font-size: 14px;

      &.name:not(.overflow) {
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
