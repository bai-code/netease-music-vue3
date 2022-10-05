<template>
  <el-row type="flex" justify="space-between" align="middle" class="footer-container">
    <el-col :span="6">
      <div class="music-info" v-if="musicInfo.name">
        <div class="music-img overflow pointer">
          <el-image :src="musicInfo.picUrl"> </el-image>
          <div class="mask-layer">
            <!-- <i class="iconfont icon"></i> -->
            <div class="arrow-up flexCenter" @click="goMusicDetailPage">
              <i class="iconfont icon-arrow-up"></i>
            </div>
            <!-- <div class="arrow-down">
              <i class="iconfont icon-arrow-down"></i>
            </div> -->
          </div>
        </div>
        <div class="music-name">
          <span class="overflow name">{{ musicInfo.name }}</span>
          <span class="overflow singer">{{ musicInfo.singer }}</span>
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
        <div class="start-time">{{ currentTime }}</div>
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
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

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

const router = useRouter()
const goMusicDetailPage = () => {
  const { id } = store.state.musicInfo
  // console.log(id, router)
  router.push({ name: 'music-detail', query: { id } })
}
</script>

<style lang="less" scoped>
.el-row.footer-container {
  height: 70px;
  padding: 0 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  border-top: 1px solid @borderColor;
  width: 100%;
  div.music-info {
    height: 100%;
    display: flex;
    // width: 100%;

    div.music-img {
      flex: 0 0 auto;
      height: 50px;
      width: 50px;
      border-radius: 3px;
      position: relative;
      .el-image {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      div.mask-layer {
        position: absolute;
        height: 100%;
        width: 100%;
        &:hover div.arrow-up {
          opacity: 1;
        }
        div.arrow-up,
        div.arrow-down {
          // display: none;
          position: absolute;
          width: 100%;
          opacity: 0;
          height: 100%;
          transition: opacity 0.4s ease-in-out;
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
      padding: 5px;
      box-sizing: border-box;
      .flex(space-between, flex-start);
      flex-direction: column;
      span {
        display: inline-block;
        width: 100%;
        &.singer {
          color: @singerColor;
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
          width: 60px;
          flex: 0 0 auto;
          text-align: center;
          color: @singerColor;
        }
        &.progress {
          width: calc(100% - 100px);
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
