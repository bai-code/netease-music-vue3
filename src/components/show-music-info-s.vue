<template>
  <div class="show-music-info-s overflow" type="flex" :style="{ height: ch }">
    <div class="image pointer overflow" @click="playMusic" :style="{ height: ch, width: ch }">
      <img v-lazy="musicInfo.picUrl" alt="" />
      <span class="icon">
        <i class="iconfont icon-hover"></i>
      </span>
    </div>
    <div class="musicInfo">
      <p class="overflow">
        <span class="name">{{ musicInfo.name }}</span
        ><span class="alias" v-if="musicInfo.song.alias.length">({{ musicInfo.song.alias[0] }})</span>
      </p>
      <span class="overflow pointer">{{ musicInfo.singer }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useStore } from 'vuex'
import { playAndCommit } from '@/utils/plugins'
const props = defineProps({
  musicInfo: {
    type: Object,
    default: () => {
      return {
        picUrl: '',
        name: 'xxxx',
        singer: 'yyyyy'
      }
    }
  },
  // 宽高
  ch: {
    type: [String, Number],
    validator: (data) => {
      if (typeof data === 'string') {
        return data
      } else {
        return data + 'px'
      }
    },
    default: '50px'
  }
})

const store = useStore()
const playMusic = () => {
  playAndCommit({ store, musicInfo: props.musicInfo })
  // console.log(props.musicInfo)
}
</script>

<style lang="less" scoped>
div.show-music-info-s {
  margin-top: 20px;
  border-radius: 5px;
  padding: 3px 0;
  box-sizing: border-box;
  &:hover {
    background: @hoverColor;
    cursor: default;
  }
  .flex(flex-start,flex-start);
  div.image {
    position: relative;
    box-sizing: border-box;
    flex: 0 0 auto;
    border-radius: 5px;
    img {
      height: inherit;
      width: inherit;
    }
    span.icon {
      .positions(50%,50%);
      transform: translate(-50%, -50%);
      background: #fff;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      .flex(center,center);
      i.iconfont {
        color: @bgColor;
      }
    }
  }
  div.musicInfo {
    .flex(space-between,flex-start);
    flex-direction: column;
    flex: 0 0 auto;
    width: calc(100% - 65px);
    height: 100%;
    margin-left: 10px;
    // box-sizing: border-box;
    & > p {
      width: 100%;
      margin: 0;
      flex: 0 0 auto;
      font-size: 14px;
      span.alias {
        color: @singerColor;
      }
    }
    & > span {
      flex: 0 0 auto;
      display: inline-block;
      // width: 100%;
      font-size: 12px;
      overflow: hidden;
      color: @singerColor;
      &:hover {
        color: inherit;
      }
    }
  }
}
</style>
