<template>
  <transition name="content">
    <keep-alive>
      <component :is="showCmp" @packUp="goBackPage"></component>
    </keep-alive>
  </transition>

  <el-row type="flex" justify="space-between" align="middle" class="footer-container">
    <el-col :span="7" class="info">
      <div class="container" :style="{ bottom: domBottom }">
        <div class="arrow-down pointer" @click="goBackPage">
          <i class="iconfont icon-arrow-down"></i>
        </div>
        <div class="music-info" v-if="musicInfo.name">
          <div class="music-img overflow pointer">
            <m-image class="el-image" :src="musicInfo.picUrl"> </m-image>
            <div class="mask-layer">
              <!-- <i class="iconfont icon"></i> -->
              <div class="arrow-up-down" v-if="musicInfo.isFmMusic" @click="$router.push({ name: 'personal-fm' })">
                <i class="iconfont icon-arrow-up"></i>
                <i class="iconfont icon-arrow-down"></i>
              </div>
              <div class="arrow-up flexCenter" @click="goMusicDetailPage" v-else>
                <i class="iconfont icon-arrow-up"></i>
              </div>
            </div>
          </div>
          <div class="music-name">
            <div class="name">
              <span class="name overflow" :title="musicInfo.name">{{ musicInfo.name }}</span>
              <span class="icon iconStyle" v-if="musicInfo.fee === 1"> VIP </span>
            </div>
            <span class="overflow singer" :title="musicInfo.singer">{{ musicInfo.singer }}</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="11" class="controls-container">
      <div class="controls">
        <div class="prev pointer" :class="{ disabled: isNotChange || musicInfo.isFmMusic }" @click="changeMusic('prev')">
          <i class="iconfont icon-prev"></i>
        </div>
        <div class="play-pause" @click="changePlayStatus">
          <div class="play pointer" v-show="!isPlay">
            <i class="iconfont icon-play"></i>
          </div>
          <div class="pause pointer" v-show="isPlay">
            <i class="iconfont icon-pause"></i>
          </div>
        </div>
        <div class="next pointer" :class="{ disabled: isNotChange && !musicInfo.isFmMusic }" @click="changeMusic('next')">
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="progress-c">
        <div class="start-time overflow">
          <span v-if="musicInfo.durationTime">{{ currentTime }}</span>
        </div>
        <div class="progress-content">
          <div class="progress-bar" @mousedown="mousedown" ref="domRef">
            <div class="guage" :style="{ width: domW + 'px' }">
              <div class="current-time-dot" @mousedown.stop="dotMousedown">
                <el-icon class="is-loading" v-if="isPlay">
                  <Loading />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="end-time">{{ musicInfo.durationTime }}</div>
      </div>
    </el-col>
    <!-- 音质 -->
    <el-col :span="4" class="other-select">
      <div class="quality-content">
        <QualitySelect :qualityList="musicInfo.privilege && musicInfo.privilege.chargeInfoList" @changeQuality="changeQuality" />
      </div>
      <div class="loopStatus">
        <LoopStatusSelect :list="loopList" spreadDirection="top" @selectItem="selectItem" />
      </div>
      <div class="list" title="播放列表">
        <el-icon class="pointer" :size="18" @click="changeDrawerStatus"><Expand /></el-icon>
      </div>
    </el-col>
  </el-row>
  <Teleport to="#main-teleport-body">
    <el-dialog v-model="dialogVisible" title="Tips" width="400px" :show-close="false" :modal="false" custom-class="dialog-content">
      <template #header>
        <div class="header">
          <h3 class="title">当前播放</h3>
          <el-row class="show-other" type="flex" justify="space-between">
            <span class="show-count">总{{ musicList.length }}首</span>
            <span class="clear-list pointer" @click="clearPlayList">清空列表</span>
          </el-row>
        </div>
      </template>
      <el-scrollbar height="330px">
        <MusicListTable :showMusicList="musicList" :isShowHeader="false" :showIndex="false" :showAlbum="false" :drawerMode="true" />
      </el-scrollbar>
    </el-dialog>
  </Teleport>
</template>

<script setup>
import { computed, ref, shallowRef, h, onDeactivated, watchEffect, nextTick } from 'vue'
import { useStore } from 'vuex'
import audio from '@/utils/audio.js'
import MusicDetailContent from '@/views/views-package/music-detail-content.vue'
import QualitySelect from './home-footer/quality-select.vue'
import { playAndCommit } from '@/utils/playAndCommit.js'
import { Expand } from '@element-plus/icons-vue'
import LoopStatusSelect from './home-footer/loopStatus-select.vue'
import MusicListTable from '@/components/music-list-table.vue'

const tempCmp = h('div') // 创建一个空组件
const showCmp = shallowRef(tempCmp)
const isDetail = ref(false)
const store = useStore()

const isPlay = computed(() => {
  return store.state.isPlay
})

const isNotChange = computed(() => {
  return store.getters.isNotChange
})

const changePlayStatus = () => {
  if (!store.state.musicInfo.id) return
  if (!isPlay.value) {
    store.commit('play')
  } else {
    store.commit('pause')
  }
}

const musicInfo = computed(() => {
  return store.state.musicInfo
})
const musicList = computed(() => {
  return store.state.musicList
})
// 转换后的该歌曲总时长 00 ： 00
const currentTime = computed(() => {
  return store.getters.setCurrentTime
})

const changeMusic = (params) => {
  if (musicInfo.value.isFmMusic && params === 'prev') return
  if (musicInfo.value.isFmMusic) {
    store.dispatch('personalFm/getFm', { isPlay: true })
  } else {
    store.dispatch('changeMusic', { params })
  }
}

// 播放结束下一首
audio.addEventListener('ended', function () {
  changeMusic('next')
})

const domBottom = ref(0) // 点击歌曲图片展示歌词页面，点击部分下移距离

const goBackPage = () => {
  domBottom.value = 0
  isDetail.value = false
  showCmp.value = tempCmp
}
const goMusicDetailPage = () => {
  isDetail.value = true
  domBottom.value = '-70px'
  showCmp.value = MusicDetailContent
}

const precentage = computed(() => {
  return store.getters.setPrecentage
})

const domRef = ref() // dom元素
const domWidth = ref(0)

// 获取并设置progres宽度
nextTick(() => {
  domWidth.value = domRef.value.offsetWidth
})
const seekTime = (num) => {
  const time = parseInt((num / domWidth.value) * durationTime.value)
  store.commit('seekTime', { time })
}

const durationTime = computed(() => {
  return store.state.durationTime
})

// 进度条区域
const domW = ref(0) // dom 宽度
// 点击进度条跳转
const mousedown = (e) => {
  domW.value = e.offsetX
  seekTime(e.offsetX)
}
const isDrag = ref(false) // 判定是否在拖动状态
// 进度条拖动
const dotMousedown = (e) => {
  isDrag.value = true
  const offsetL = e.currentTarget.offsetLeft
  const dotL = e.pageX - offsetL
  const domWidth = domRef.value.offsetWidth
  document.onmousemove = (e) => {
    const l = e.pageX - dotL + 6
    domW.value = l > domWidth ? domWidth : l
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      isDrag.value = false
      // console.log(precentage)
      // domRef.value.style.transition = ' all 0.5s ease-in'
      seekTime(domW.value)
    }
  }
}

// 监听 并设置进度条宽度
watchEffect(() => {
  if (isDrag.value) return
  domW.value = precentage.value * domWidth.value
  // domW.value = precentage.value * domWidth.value
})

// 子组件传递   切换播放音质
const oldVal = ref('')
const changeQuality = async (val) => {
  if (oldVal.value === val) return
  const time = audio.currentTime || 0
  await playAndCommit({ musicInfo: musicInfo.value, level: val, isPlay: isPlay.value })
  store.commit('seekTime', { time })
  oldVal.value = val
}
const dialogVisible = ref(false)

const changeDrawerStatus = () => {
  dialogVisible.value = !dialogVisible.value
}

// 清除播放列表
const clearPlayList = () => {
  store.commit('saveMusicList', { musicList: [] })
}

const loopList = shallowRef([
  {
    id: 0,
    text: '单曲播放',
    icon: 'icon-single',
    loopStatus: 'single'
  },
  {
    id: 1,
    text: '单曲循环',
    icon: 'icon-single-cycle',
    loopStatus: 'singleCycle'
  },
  {
    id: 2,
    text: '列表播放',
    icon: 'icon-order',
    loopStatus: 'list'
  },
  {
    id: 3,
    text: '列表循环',
    icon: 'icon-list-loop',
    loopStatus: 'list-loop'
  },
  {
    id: 4,
    text: '随机播放',
    icon: 'icon-random',
    loopStatus: 'random'
  }
])

const oldLoopStatus = ref()
const selectItem = (val) => {
  const { loopStatus } = val
  if (loopStatus === oldLoopStatus.value) return
  store.commit('changeLoopStatus', { loopStatus })
  oldLoopStatus.value = loopStatus
}

// 用于视频播放页面，暂停音乐播放
onDeactivated(() => {
  store.commit('pause')
})
</script>

<style lang="less" scoped>
.drawer-container {
  height: 420px;
  top: 60px;
}

.content-enter-active,
.content-leave-active {
  transition: all 0.5s ease-in;
}
.el-row.footer-container {
  height: 70px;
  padding: 0 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  border-top: 1px solid @borderColor;
  width: 100%;
  .el-col.info {
    height: 100%;
    position: relative;
    overflow: hidden;
    div.container {
      position: absolute;
      height: 200%;
      .flex(flex-start,flex-start);
      flex-direction: column;
      width: 100%;
      bottom: 0;
      transition: all 0.5s ease-in-out;
      div.arrow-down {
        height: 50%;
        width: 50px;
        flex: 0 0 auto;
        .flex(center,center);
        i.iconfont {
          font-size: 30px;
        }
      }
      div.music-info {
        height: 50%;
        box-sizing: border-box;
        padding: 11px 1px;
        width: 100%;
        .flex(flex-start,center);

        div.music-img {
          flex: 0 0 auto;
          height: 100%;
          width: 50px;
          border-radius: 3px;
          position: relative;
          box-shadow: 0px 0 5px #ccc;

          .el-image {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
          div.mask-layer {
            position: absolute;
            height: 100%;
            width: 100%;
            &:hover {
              div.arrow-up,
              div.arrow-up-down {
                opacity: 1;
              }
            }
            div.arrow-up-down {
              // background: rgba(0, 0, 0, 0.4);
              .flex(center,center);
              flex-direction: column;
              i.iconfont {
                line-height: 24px;
              }
            }
            div.arrow-up,
            div.arrow-up-down {
              position: absolute;
              width: 100%;
              opacity: 0;
              height: 100%;
              transition: opacity 0.3s ease-in-out;
              // &.arrow-up {
              background: rgba(0, 0, 0, 0.4);
              i.iconfont {
                color: #fff;
                font-size: 30px;
              }
              // }
            }
          }
        }
        div.music-name {
          flex: 0 0 auto;
          width: calc(100% - 65px);
          height: 100%;
          .flex(space-between, flex-start);
          flex-direction: column;
          padding: 3px 3px 3px 10px;
          box-sizing: border-box;
          div.name {
            flex: 0 0 auto;
            width: 100%;
            white-space: nowrap;
            .flex(flex-start,center);
            span.name {
              padding-right: 5px;
              // flex: 0 0 auto;
              // display: inline-block;
              // width: calc(100% - 30px);
            }
            span.icon {
              flex: 0 0 auto;
            }
          }
          & > span {
            display: inline-block;
            width: 100%;
            &.singer {
              color: @singerColor;
            }
          }
        }
      }
    }
  }

  .el-col.controls-container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    flex-direction: column;
    div.controls {
      display: flex;
      width: 40%;
      .flex(space-between,center);
      color: rgba(0, 0, 0, 0.5);
      & > div {
        padding: 5px;
        box-sizing: border-box;
        &:hover {
          background: rgba(0, 0, 0, 0.2);
          color: @bgColor;
          border-radius: 50%;
        }
        &.disabled {
          color: #ccc;
          &:hover {
            background: none;
            color: #ccc;
            cursor: default;
          }
        }
      }
    }
    div.progress-c {
      flex: 0 0 auto;
      width: 100%;
      height: 10px;
      .flex(space-between,center);
      & > div {
        height: 20px;
        &.start-time,
        &.end-time {
          white-space: nowrap;
          width: 60px;
          flex: 0 0 auto;
          text-align: center;
          color: @singerColor;
        }
        &.progress-content {
          position: relative;
          width: 270px;
          height: 6px;
          & > .progress-bar {
            width: 100%;
            position: relative;
            height: 100%;
            background: #ddd;
            border-radius: 6px;
            div.guage {
              background: @bgColor;
              height: 100%;
              border-radius: 6px;
              position: relative;
              .flex(flex-end, center);
              div.current-time-dot {
                position: absolute;
                right: 0;
                height: 12px;
                width: 12px;
                background: rgba(236, 65, 65, 0.9);
                transform: translateX(50%);
                border-radius: 50%;
                .flex(center,center);
                .el-icon {
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
  .el-col.other-select {
    .flex(space-between,center);
    div.quality-content {
      flex: 0 0 auto;
      min-width: 35px;
    }
    div.loopStatus {
      .flex(space-between,center);
      :deep(.m-select) {
        div.show-title {
          i.iconfont {
            font-size: 16px;
          }
        }
      }
    }
    div.list {
      .flex(center,center);
    }
  }
}
</style>

<style lang="less">
/* 用于解决teleprot添加到el-main中的样式 */
.dialog-content {
  position: absolute !important;
  width: 400px;
  margin: 0 !important;
  right: 0;
  height: 420px;
  top: 60px;
  box-shadow: 0 0 3px #ccc;
  .el-dialog__header {
    padding: 0 0 10px 10px;
    div.header {
      h3.title {
        margin-bottom: 10px;
      }
      .el-row.show-other {
        & > span {
          font-size: 12px;
          &.show-count {
            color: #ccc;
          }
          &.clear-list {
            color: @blueColor;
          }
        }
      }
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
