<!-- 包装组件歌单 -->
<!-- 歌单组件 -->
<template>
  <el-scrollbar>
    <div class="song-list-package paddingRight">
      <el-row class="music-info" type="flex">
        <el-col :span="7"> <el-image :src="musicInfo.coverImgUrl"></el-image></el-col>
        <el-col :span="16">
          <div class="name">
            <span class="tag-name">歌单</span>
            <h2 class="playlist-name overflow" :title="musicInfo.name">{{ musicInfo.name }}</h2>
          </div>
          <el-col class="creator">
            <div class="container" v-if="musicInfo.creator">
              <div class="avatar">
                <el-image :src="musicInfo.creator.avatarUrl"></el-image>
                <el-image v-if="musicInfo.creator.avatarDetail" :src="musicInfo.creator.avatarDetail.identityIconUrl" class="tag"></el-image>
              </div>
              <span class="create-user pointer">{{ musicInfo.creator.nickname }}</span>
              <span class="create-date default">{{ createTime }} 创建</span>
            </div>
          </el-col>
          <el-col class="controls">
            <div class="play-all pointer">
              <div class="play" @click="playMusic('all')">
                <i class="iconfont icon-hover"></i>
                <span class="text">播放全部</span>
              </div>
              <el-tooltip content="建设中..." placement="top-end">
                <div class="add">
                  <i class="iconfont icon-add"></i>
                </div>
              </el-tooltip>
            </div>
            <el-tooltip content="建设中..." placement="top">
              <div class="collect pointer">
                <i class="iconfont icon-folder"></i>
                <span class="c">收藏 ({{ subscribedCount }})</span>
              </div>
            </el-tooltip>
            <el-tooltip content="建设中..." placement="top">
              <div class="collect pointer">
                <i class="iconfont icon-share"></i>
                <span class="c">分享 ({{ shareCount }})</span>
              </div>
            </el-tooltip>
            <el-tooltip content="建设中..." placement="top">
              <div class="collect pointer">
                <i class="iconfont icon-download"></i>
                <span class="c">下载全部</span>
              </div>
            </el-tooltip>
          </el-col>
          <el-col class="tag" v-if="musicInfo.tags && musicInfo.tags.length > 0">
            <div>标签：</div>
            <div v-for="(tag, index) in musicInfo.tags" :key="index">
              <span class="pointer tag">{{ tag }}</span>
              <span v-if="index != musicInfo.tags.length - 1" class="symbol">/</span>
            </div>
          </el-col>
          <el-col class="playCount">
            <span>歌曲：</span>
            <span class="show-num" v-if="musicInfo.trackIds">{{ musicInfo.trackIds.length }}</span>
            <span class="gutter">播放：</span>
            <span class="show-num">{{ playCount }}</span>
          </el-col>
          <el-col class="description">
            <el-row>
              <el-col :span="22" class="description-content">
                <div class="content">
                  <span class="title">简介：</span>
                  <span class="content" :class="[isSpread ? '' : 'overflow']" ref="domRef">{{ musicInfo.description }}</span>
                </div>
              </el-col>
              <el-col :span="2" @click="spreadContext" v-if="true">
                <i class="iconfont icon-pull-up" v-if="isSpread" key="up"></i>
                <i class="iconfont icon-pull-down" key="down" v-else></i>
              </el-col>
            </el-row>
          </el-col>
        </el-col>
      </el-row>
      <el-row class="title-search" type="flex" justify="space-between">
        <el-col :span="12">
          <ul class="select-item">
            <li v-for="(select, index) in selectList" :class="[{ select: index === selectIndex }, 'pointer']" :key="select.id" @click="changeSelectItem(index)">
              {{ select.text }}
              <span v-if="select.commentCount || select.commentCount === 0">({{ select.commentCount }})</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="5">
          <el-input :suffix-icon="Search" v-model="inputValue" placeholder="歌名/歌手"></el-input>
        </el-col>
      </el-row>
      <el-row class="music-list">
        <component :is="showCmp" :mId="mId" @playMusic="playMusic" :showMusicList="showMusicList" />
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { watch, ref, computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computedCount, loopFilterAdd, findItemIndex, playAndCommit, filterMusicList } from '@/utils/plugins.js'
import { Search } from '@element-plus/icons-vue'
import Comment from './song-list-package/comment.vue'
import Collector from './song-list-package/collector.vue'
import MusicList from '@/components/music-list-table.vue'

const showCmp = shallowRef(MusicList)
const mId = ref(0)
// 切换组件
const isSpread = ref(false)

const selectList = ref([
  {
    id: 0,
    text: '歌曲列表'
  },
  {
    id: 1,
    text: '评论',
    commentCount: 0
  },
  {
    id: 2,
    text: '收藏者'
  }
])
const selectIndex = ref(0)
watch(
  selectIndex,
  (index) => {
    isSpread.value = false
    switch (index) {
      case 0:
        showCmp.value = MusicList
        break
      case 1:
        showCmp.value = Comment
        break
      case 2:
        showCmp.value = Collector
        break
    }
  },
  { immediate: true }
)
const changeSelectItem = (index) => {
  selectIndex.value = index
}

const route = useRoute()
const store = useStore()

const musicInfo = ref({})

const domRef = ref()

const musicList = ref([])
const showMusicList = ref([])
// const comments = ref(0) // 评论数
const getMusicList = async (pId) => {
  const { playlist = {} } = await store.dispatch('getInfo', { path: `/playlist/detail?id=${pId}` })
  musicInfo.value = playlist
  selectList.value[1].commentCount = playlist.commentCount
  // console.log(playlist)

  const { songs } = await store.dispatch('getInfo', { path: `/playlist/track/all?id=${pId}` })
  showMusicList.value = musicList.value = loopFilterAdd({ musicList: songs, artists: 'ar', transTime: true, timeName: 'dt' })
}

watch(
  () => route.params.pId,
  async (pId) => {
    if (!pId) return
    mId.value = pId
    getMusicList(pId)
  },
  { immediate: true }
)

// 时间 管道符
const createTime = computed(() => {
  if (musicInfo.value.createTime) {
    return new Date(musicInfo.value.createTime).toLocaleDateString().split('/').join('-')
  }
  return 0
})

const subscribedCount = computed(() => {
  return computedCount(musicInfo.value.subscribedCount)
})

const shareCount = computed(() => {
  return computedCount(musicInfo.value.shareCount)
})

const playCount = computed(() => {
  return computedCount(musicInfo.value.playCount)
})

// 是否展开专辑简介
const spreadContext = () => {
  if (isSpread.value) {
    domRef.value.classList.add('curt')
    isSpread.value = false
  } else {
    domRef.value.classList.remove('curt')
    isSpread.value = true
  }
}

const inputValue = ref('')
const playMusic = (row) => {
  let index = 0
  if (row !== 'all') {
    index = findItemIndex({ musicList: showMusicList.value, params: row.name })
  }
  playAndCommit({ musicList: showMusicList.value, index })
}

// 搜索框事件
const searchMusicList = () => {
  showMusicList.value = filterMusicList({ musicList: musicList.value, query: ['name', 'singer', 'al'], params: inputValue.value, params1: 'name' })
}

watch(
  inputValue,
  (newVal) => {
    if (!newVal) {
      showMusicList.value = musicList.value
    } else {
      searchMusicList()
    }
  },
  { immediate: true }
)

// const descRef = ref()
// const isShowSpreadBtn = computed(() => {
//   const h = descRef.value && descRef.value.offsetHeight
//   if (h <= 25) {
//     return false
//   } else {
//     return true
//   }
// })
// console.log(isShowSpreadBtn)
</script>
<style lang="less" scoped>
div.song-list-package {
  //歌曲信息
  .el-row.music-info {
    font-size: 13px;
    margin-bottom: 30px;
    min-height: 190px;
    & > .el-col {
      .el-image {
        border-radius: 5px;
        height: 185px;
        width: 185px;
      }
      div.name {
        .flex(flex-start,center);
        width: 100%;
        span.tag-name {
          border: 1px solid @bgColor;
          color: @bgColor;
          border-radius: 4px;
          padding: 0 5px;
          width: 30px;
        }
        h2.playlist-name {
          display: inline-block;
          margin: 5px 10px;
        }
      }
      .el-col.creator {
        margin-bottom: 10px;
        height: 33px;
        div.container {
          .flex(flex-start,center);
          div.avatar {
            display: inline-block;
            position: relative;
            .el-image {
              height: 30px;
              width: 30px;
              border-radius: 50%;
              &.tag {
                height: 13px;
                width: 13px;
                position: absolute;
                left: 19px;
                bottom: 2px;
              }
            }
          }
          & > span {
            font-size: 12px;
            margin-left: 10px;
            &.create-user {
              color: #507daf;
              &:hover {
                color: #0b58b0;
              }
            }
            &.create-date {
              color: #666;
            }
          }
        }
      }
      .el-col.controls {
        .flex(flex-start, center);
        font-size: 12px;
        margin-bottom: 15px;
        div.play-all {
          .flex(flex-start,center);
          color: #fff;
          div.play {
            padding: 6px 10px;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            background: @bgColor;
            &:hover {
              opacity: 0.9;
            }
            span.text {
              margin-left: 5px;
            }
          }
          div.add {
            flex: 1 1 auto;
            text-align: center;
            background: @bgColor;
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
            padding: 6px 10px 6px 6px;
            &:hover {
              opacity: 0.9;
            }
          }
        }
        div.collect {
          border-radius: 20px;
          padding: 5px 10px;
          border: 1px solid #ccc;
          margin-left: 15px;
          span.c {
            margin-left: 5px;
          }
        }
      }
      .el-col.tag {
        .flex(flex-start,center);
        span.tag {
          color: #507daf;
          &:hover {
            color: #0b58b0;
          }
        }
        span.symbol {
          padding: 0 3px;
        }
      }
      .el-col.playCount {
        margin: 10px 0;
        span {
          &.gutter {
            margin-left: 10px;
          }
          &.show-num {
            color: #666;
          }
        }
      }
      .el-col.description {
        .el-col.description-content {
          width: 100%;
          div.content {
            // .overflow;
            display: flex;
            line-height: 22px;
            // .flex(flex-start,center);
            span.title {
              flex: 0 0 auto;
            }
            span.content {
              flex: 0 0 auto;
              width: calc(100% - 40px);
              color: #666;
              // line-height: 20px;

              // display: inline-block;
            }
          }
        }
      }
    }
  }
  // 歌曲标题
  .el-row.title-search {
    .el-col {
      ul.select-item {
        .flex(flex-start,center);
        margin-bottom: 15px;
        & > li {
          margin-right: 10px;
          &.select {
            font-size: 20px;
            font-weight: bolder;
            border-bottom: 3px solid @bgColor;
            padding-bottom: 4px;
          }
        }
      }
    }
  }
  .el-row.music-list {
    div.loading {
      height: 50px;
      width: 100%;
    }
    // :deep(.el-table) {
    //   .headerRowStyle {
    //     .cell {
    //       color: #333;
    //     }
    //   }
    //   .currentActive {
    //     background: rgba(0, 0, 0, 0.2) !important;
    //   }
    //   .index {
    //     color: #ccc;
    //   }
    //   .column-item {
    //     &.title-name {
    //       color: #333;
    //     }
    //     .cell {
    //       overflow: hidden;
    //       white-space: nowrap;
    //     }
    //     &.album,
    //     &.singer {
    //       &:hover {
    //         color: #666;
    //       }
    //     }
    //     &.album,
    //     &.singer,
    //     &.durationTime {
    //       color: @singerColor;
    //     }
    //   }
    // }
  }
}
</style>
