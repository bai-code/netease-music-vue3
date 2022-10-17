<template>
  <transition name="content">
    <keep-alive>
      <component :is="showCmp" @packUp="goBackPage" :lyricList="lyricList"></component>
    </keep-alive>
  </transition>

  <el-row type="flex" justify="space-between" align="middle" class="footer-container">
    <el-col :span="6" class="info">
      <div class="container" :style="{bottom:domBottom}">
        <div class="arrow-down pointer" @click="goBackPage">
          <i class="iconfont icon-arrow-down"></i>
        </div>
        <div class="music-info" v-if="musicInfo.name">
          <div class="music-img overflow pointer">
            <el-image :src="musicInfo.picUrl"> </el-image>
            <div class="mask-layer">
              <!-- <i class="iconfont icon"></i> -->
              <div class="arrow-up flexCenter" @click="goMusicDetailPage">
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
        <div class="prev pointer" :class="{ disabled: isNotChange }" @click="changeMusic('prev')">
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
        <div class="next pointer" :class="{ disabled: isNotChange }" @click="changeMusic('next')">
          <i class="iconfont icon-next"></i>
        </div>
      </div>
      <div class="progress-c">
        <div class="start-time overflow">{{ currentTime }}</div>
        <div class="progress">
          <!-- <progress class="progress" :value="musicInfo.progressPrecentage" max="100"></progress> -->
          <el-progress :stroke-width="8" :show-text="false" :percentage="precentage" />
        </div>
        <div class="end-time">{{ musicInfo.durationTime }}</div>
        <!-- <span class="dots"></span> -->
      </div>
    </el-col>
    <el-col :span="4"> 音质 播放列表 </el-col>
  </el-row>
</template>

<script setup>
import { computed, ref, shallowRef, h, watch } from 'vue'
import { useStore } from 'vuex'
// import { useRouter } from 'vue-router'
import MusicDetailContent from '@/views/views-package/music-detail-content.vue'

// console.log(MusicDetailContent)
const showCmp = shallowRef(h('div'))
const isDetail = ref(false)

const store = useStore()

const isPlay = computed(() => {
  return store.state.isPlay
})

const isNotChange = computed(() => {
  return store.getters.isNotChange
})

// 获取歌词
const lyricList = ref([])
const getMusicLyric = async (id) => {
  const {
    lrc: { lyric }
  } = await store.dispatch('getInfo', { path: `/lyric?id=${id}` })
  lyricList.value = lyric
    .split(/\[/g)
    .map((item) => {
      const text = item.split(/\..+\]/)
      if (text[0] && text[1] !== '\n') {
        return text
      }
    })
    .filter((item) => {
      // 用于处理歌词多处空格
      return !!item
    })
  // const res = await store.dispatch('getInfo', { path: `/lyric?id=${id}` })
  // console.log(res)
}

watch(
  () => store.state.musicInfo.id,
  (newId) => {
    // getMusicDetail(newId)
    getMusicLyric(newId)
  },
  {
    immediate: true
  }
)

const changePlayStatus = () => {
  if (!store.state.musicInfo.id) return
  if (!isPlay.value) {
    store.commit('play')
  } else {
    store.commit('pause')
  }
}

const changeMusic = (params) => {
  if (isNotChange.value) return
  store.dispatch('changeMusic', { params })
}

const musicInfo = computed(() => {
  return store.state.musicInfo
})

const precentage = computed(() => {
  return store.getters.setPrecentage
})
const currentTime = computed(() => {
  return store.getters.setCurrentTime
})

const domBottom = ref(0)

const goBackPage = () => {
  domBottom.value = 0
  isDetail.value = false
  showCmp.value = h('div')
}
const goMusicDetailPage = () => {
  isDetail.value = true
  domBottom.value = '-70px'
  showCmp.value = MusicDetailContent
}
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
          }
          div.mask-layer {
            position: absolute;
            height: 100%;
            width: 100%;
            &:hover div.arrow-up {
              opacity: 1;
            }
            div.arrow-up {
              position: absolute;
              width: 100%;
              opacity: 0;
              height: 100%;
              transition: opacity 0.3s ease-in-out;
              &.arrow-up {
                background: rgba(0, 0, 0, 0.4);
                i.iconfont {
                  color: #fff;
                  font-size: 30px;
                }
              }
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
        &.progress {
          width: calc(100% - 120px);
          .flex(center,center);
          progress.progress {
            width: 100%;
          }
          .el-progress {
            width: 100%;
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
