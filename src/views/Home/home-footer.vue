<template>
  <transition name="content">
    <keep-alive>
      <component :is="showCmp" @packUp="goBackPage"></component>
    </keep-alive>
  </transition>

  <el-row type="flex" justify="space-between" align="middle" class="footer-container">
    <el-col :span="6" class="info">
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
            <span class="overflow name">{{ musicInfo.name }}</span>
            <span class="overflow singer">{{ musicInfo.singer }}</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="10" class="controls-container">
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
            <!-- <progress class="progress" :value="musicInfo.progressPrecentage" max="100"></progress> -->
            <!-- <el-progress :stroke-width="8" :show-text="false" :percentage="precentage" @mousedown="mousedown" ref="progressRef"> -->
            <!-- </el-progress> -->
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
        <!-- <span class="dots"></span> -->
      </div>
    </el-col>
    <el-col :span="4"> 音质 播放列表 </el-col>
  </el-row>
</template>

<script setup>
import { computed, ref, shallowRef, h, onDeactivated, watchEffect, nextTick } from 'vue'
import { useStore } from 'vuex'
import audio from '@/utils/audio.js'
import MusicDetailContent from '@/views/views-package/music-detail-content.vue'

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

const currentTime = computed(() => {
  return store.getters.setCurrentTime
})

const changeMusic = (params) => {
  if ((isNotChange.value && !musicInfo.value.isFmMusic) || (musicInfo.value.isFmMusic && params === 'prev')) return
  if (musicInfo.value.isFmMusic) {
    store.dispatch('personalFm/getFm', { isPlay: true })
  } else {
    store.dispatch('changeMusic', { params })
  }
  // console.log(isPlayFm)
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
  // console.log(time)
  if (!isPlay.value) {
    store.commit('play')
  }
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

// 用于视频播放页面，暂停音乐播放
onDeactivated(() => {
  store.commit('pause')
})
</script>

<style lang="less" scoped>
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
        padding: 10px 0;
        width: 100%;
        .flex(flex-start,center);
        div.music-img {
          flex: 0 0 auto;
          height: 100%;
          width: 50px;
          border-radius: 3px;
          position: relative;
          .el-image {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            box-shadow: 0 0 5px #ccc;
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
          padding-left: 10px;
          height: 100%;
          .flex(space-between, flex-start);
          flex-direction: column;
          padding: 3px;
          box-sizing: border-box;
          span {
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
            // .flex(flex-start,center);
            position: relative;
            // progress.progress {
            //   width: 100%;
            // }
            // .el-progress {
            //   width: 100%;
            // }
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

      // span.dots{
      //   position: absolute;
      //   width: 10px;
      //   height: 10px;
      //   background: @bgColor;
      //   left: 0;

      // }
    }
  }
}
</style>
