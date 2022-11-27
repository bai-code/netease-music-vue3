<template>
  <!-- <el-scrollbar> -->
    <!-- // 每日歌曲推荐 -->
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
            <div class="collect-all pointer hoverBg">
              <span class="icon"><i class="iconfont icon-folder"></i></span>
              <span>收藏全部</span>
            </div>
          </el-tooltip>
        </el-row>
      </el-row>
    </slot>

    <div class="table-list" v-if="musicList.length">
      <musicListTable :showMusicList="musicList" :isLoading="isLoading" />
    </div>
  <!-- </el-scrollbar> -->
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { loopFilterAdd } from '@/utils/plugins.js'
import { playAndCommit } from '@/utils/playAndCommit.js'
import musicListTable from '@/components/music-list-table.vue'

const musicList = reactive([])
const isLoading = ref(false)

// 是否是每日推荐 && 当前日期
const date = new Date().getDate()
const isDaily = ref(true)

// const route = useRoute()
const store = useStore()
// 播放全部 默认第一首开始
const playAll = () => {
  playAndCommit({ store, musicList, index: 0 })
}

const getDailySongs = async () => {
  const { data, code } = await store.dispatch('getInfo', { path: '/recommend/songs' })
  if (code === 200) {
    musicList.push(...loopFilterAdd({ musicList: data.dailySongs, artists: 'ar', transTime: true }))
  }
}

onMounted(() => {
  getDailySongs()
})
</script>

<style scoped lang="less">
.el-row.daily-content {
  position: relative;
  padding: 30px 0 10px 20px;
  border-bottom: 1px solid @borderColor;
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
    padding: 10px 0;
    & > div {
      &.play-all {
        display: flex;
        flex-direction: row;
        color: #fff;

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
        .flex(center,center);
        padding: 7px 15px;
        border-radius: 20px;
        margin-left: 20px;
        border: 1px solid @borderColor;
        span.icon {
          margin-right: 5px;
        }
      }
    }
  }
}

div.table-list {
  padding: 0 20px 20px;
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
