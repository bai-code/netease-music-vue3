<template>
  <el-row type="flex" :class="[{ 'border-right': index % 2 === 0 }, 'mv-ranking', { 'border-bottom': !isLastTwo }]">
    <el-col class="index" :span="3">
      <span class="index">{{ fillNum(index + 1) }}</span>
      <span class="icon" v-if="rankingInfo.lastRank > index"> <i class="iconfont icon-up"></i></span>
      <span class="icon" v-else-if="rankingInfo.lastRank < index"> <i class="iconfont icon-down"></i></span>
      <span class="icon" v-else>-</span>
    </el-col>
    <el-col :span="20" class="info">
      <div class="image" @click="playMv">
        <el-image class="pointer" :src="rankingInfo.cover"></el-image>
        <div class="score">
          <span><i class="iconfont icon-fire"></i></span>
          <span>{{ rankingInfo.score }}</span>
        </div>
      </div>
      <div class="info">
        <p class="name overflow pointer fontHover" @click="playMv">{{ rankingInfo.name }}</p>
        <span class="author overflow pointer singerHover">{{ rankingInfo.author }}</span>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { fillNum } from '@/utils/plugins.js'

const props = defineProps({
  rankingInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  index: {
    type: Number,
    default: 0
  },
  isLastTwo: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const playMv = () => {
  const { id } = props.rankingInfo
  router.push({ name: 'video-detail', query: { mvid: id } })
}
</script>

<style lang="less" scoped>
@containerH: 93px;
.el-row.mv-ranking {
  height: 130px;
  display: flex;
  align-items: center;
  &.border-right {
    border-right: 1px solid #eee;
  }
  &.border-bottom {
    border-bottom: 1px solid #eee;
  }
  .el-col.index {
    .flex(center,center);
    flex-direction: column;
    span.index {
      font-size: 22px;
      color: #aaa;
    }
    span.icon {
      height: 0;
      color: #999999;
      i.iconfont {
        font-size: 12px;
        &.icon-down {
          color: #2c77ca;
        }
        &.icon-up {
          color: @bgColor;
        }
      }
    }
  }
  .el-col.info {
    .flex(flex-start,flex-start);
    div.image {
      flex: 0 0 auto;
      height: @containerH;
      width: 173px;
      box-shadow: 0 0 3px #ccc;
      position: relative;
      overflow: hidden;
      .el-image {
        border-radius: 5px;
        height: 100%;
        width: 100%;
      }
      div.score {
        position: absolute;
        left: 0px;
        top: 0;
        width: 100%;
        color: #eee;
        font-size: 12px;
        height: 20px;
        background: linear-gradient(rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.1) 100%);
        text-align: end;
        padding: 0 10px;
        box-sizing: border-box;
        line-height: 20px;
        i.iconfont {
          font-size: inherit;
        }
      }
    }
    div.info {
      width: calc(100% - 185px);
      margin-left: 10px;
      .flex(flex-start,flex-start);
      flex-direction: column;
      height: 100%;
      p.name {
        width: 100%;
      }
      span.author {
        width: 100%;
        line-height: calc(@containerH - 16px * 2);
        color: @singerColor;
        font-size: 12px;
      }
    }
  }
}
</style>
