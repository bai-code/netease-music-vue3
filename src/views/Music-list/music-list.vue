<template>
  <el-scrollbar>
    <slot v-if="isDaily">
      <el-row class="daily-content">
        <el-row class="dailySongs">
          <el-col :span="4" class="daily-date">
            <div class="date">
              <div class="today">{{ date }}</div>
            </div>
          </el-col>
          <el-col :span="18" class="daily-text">
            <h3>每日歌曲推荐</h3>
            <span>根据你的音乐口味生成，每日6:00更新</span>
          </el-col>
        </el-row>

        <el-row class="play-controls">
          <div class="play-all">
            <div class="all pointer" @click="playAll">
              <span class="play">
                <i class="iconfont icon-hover"></i>
              </span>
              <span>播放全部</span>
            </div>
            <el-tooltip content="建设中......" placement="top"
              ><div class="add pointer"><i class="iconfont icon-add"></i></div
            ></el-tooltip>
          </div>
          <el-tooltip content="建设中......" placement="top-end">
            <div class="collect-all pointer">
              <span class="icon"><i class="iconfont icon-folder"></i></span>
              <span>收藏全部</span>
            </div>
          </el-tooltip>
        </el-row>
      </el-row>
    </slot>
    <div class="infinite-list" v-if="musicList.length">
      <el-row v-for="(item, index) in musicList" :key="item.id" class="infinite-list-item" type="flex" align="middle" @dblclick="playMusic(index)" :class="{ active: index === currentIndex }">
        <el-col :span="2" class="index">
          <span v-if="currentIndex === index" class="currentPlay"> <i class="iconfont icon-yangshengqi"></i> </span>
          <span class="index" v-else>{{ fillNum(index + 1) }}</span>
        </el-col>
        <el-col :span="4" class="img">
          <el-image fit="fill" :src="(item.al && item.al.picUrl) || ''" alt="" />
        </el-col>
        <el-col :span="8" class="music-name overflow">{{ item.name }}</el-col>
        <el-col :offset="1" :span="7" class="singer overflow">{{ item.singer }}</el-col>
      </el-row>
      <p class="sole">------我是有底线的------</p>
    </div>
    <div class="show-empty" v-else v-loading="isLoading" style="height: 200px"></div>
  </el-scrollbar>
</template>

<script setup>
import { watchEffect, ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { loopFilterAdd, fillNum, playAndCommit } from '@/utils/plugins.js'

const musicList = reactive([])
const isLoading = ref(false)

// 是否是每日推荐 && 当前日期
const date = new Date().getDate()
const isDaily = ref(false)

const route = useRoute()
const store = useStore()
watchEffect(async () => {
  const { argu } = route.query
  isLoading.value = true
  // 是否是每日推荐重定向过来的
  if (argu === 'daily') {
    isDaily.value = true
    const { data, code } = await store.dispatch('getInfo', { path: '/recommend/songs' })
    if (code === 200) {
      musicList.push(...loopFilterAdd({ musicList: data.dailySongs, artists: 'ar' }))
    }
    // console.log(res)
  } else {
    isDaily.value = false
    const { id } = route.params
    if (argu === 'playlist') {
      // 专辑数据获取
      // 歌单数据获取
      const {
        playlist: { tracks }
      } = await store.dispatch('getInfo', { path: `/playlist/detail?id=${id}` })
      musicList.push(...loopFilterAdd({ musicList: tracks, artists: 'ar' }))
    } else {
      const { songs = [] } = await store.dispatch('getInfo', { path: `/album?id=${id}` })
      musicList.push(...loopFilterAdd({ musicList: songs, artists: 'ar' }))
    }
  }
  isLoading.value = false
})

const currentIndex = computed(() => {
  return store.getters.findCurrentPageIndex(musicList)
})
// 播放全部 默认第一首开始
const playAll = () => {
  playAndCommit({ store, musicList, index: 0 })
}
// 播放全部  默认当前点击歌曲为第一首
const playMusic = (index) => {
  playAndCommit({ store, musicList, index })
}
</script>

<style scoped lang="less">
.el-row.daily-content {
  margin: 10px 0 10px 20px;
  .el-row.dailySongs {
    width: 100%;
    margin-bottom: 15px;
    .el-col.daily-date {
      div.date {
        height: 70px;
        width: 80px;
        border: 4px solid @bgColor;
        border-radius: 15px;
        box-sizing: border-box;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          height: 12px;
          top: -8px;
          width: 40px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 4px dotted @bgColor;
          border-right: 4px dotted @bgColor;
        }
        div.today {
          border-top: 3px solid @bgColor;
          // margin-top: 10px;
          width: 75%;
          .posi(50%, 50% + 5px);
          text-align: center;
          line-height: 45px;
          color: @bgColor;
          font-weight: 1000;
          font-size: 2.5em;
        }
      }
    }

    .el-col.daily-text {
      & > h3 {
        font-size: 20px;
        margin-bottom: 5px;
      }
      & > span {
        font-size: 12px;
        color: #666;
      }
    }
  }
  .el-row.play-controls {
    & > div {
      color: #fff;
      &.play-all {
        display: flex;
        flex-direction: row;
        div.all {
          padding: 7px 7px 7px 13px;
          box-sizing: border-box;
          background: @bgColor;
          border-bottom-left-radius: 20px;
          border-top-left-radius: 20px;
          .flex(flex-start,center);
          span.play {
            margin-right: 5px;
          }
          &:hover {
            opacity: 0.9;
          }
        }
        div.add {
          background: @bgColor;
          .flex(center,center);
          padding: 0 10px;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
          &:hover {
            opacity: 0.9;
          }
        }
      }
      &.collect-all {
        background: @bgColor;
        .flex(center,center);
        padding: 7px 15px;
        border-radius: 20px;
        margin-left: 20px;
        span.icon {
          margin-right: 5px;
        }
      }
    }
  }
}

div.infinite-list {
  min-height: 400px;
  // height: 100%;
  overflow: hidden;
  .el-row.infinite-list-item {
    height: 60px;
    border-radius: 5px;
    &.active {
      color: @bgColor;
      background: rgba(0, 0, 0, 0.1);
    }
    .el-col {
      &.index {
        color: @singerColor;
        text-align: center;
        span.currentPlay {
          color: @bgColor;
        }
      }
      &.img {
        height: calc(100% - 20px);
        text-align: center;
        .el-image {
          border-radius: 5px;
          height: 100%;
          width: 40px;
        }
      }
      &.singer {
        color: @singerColor;
        font-size: 13px;
      }
    }
  }
  p.sole {
    text-align: center;
    color: #ccc;
  }
}
</style>
