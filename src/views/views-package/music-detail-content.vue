<template>
  <div class="music-detail-content" :style="{ height: containerHeight }">
    <div class="music-detail__content" ref="domRef">
      <HomeNav>
        <template v-slot:logo>
          <div class="arrow-down pointer" @click="packUp">
            <i class="iconfont icon-arrow-down"></i>
          </div>
        </template>
        <template v-slot:search>
          <div class="isShow" v-if="true">2222</div>
        </template>
        <template v-slot:avatar>
          <span></span>
        </template>
      </HomeNav>
      <el-row class="content">
        <el-col :span="7" class="left">
          <div class="disc-c" :style="{ transform: `rotate(${discDeg}deg)` }">
            <el-image :src="musicInfo.picUrl"></el-image>
          </div>
          <div class="needle" :style="{ transform: `rotate(${needleDeg}deg) translate(-15%,0)` }">
            <span class="bg"></span>
          </div>
        </el-col>
        <el-col :span="10" class="lyric">
          <LyricCmp :musicInfo="musicInfo" />
        </el-col>
        <el-col :span="7" class="similar-container">
          <div class="similar">
            <el-scrollbar height="100%">
              <div class="simi-title">相似歌曲</div>
              <div v-for="item in simiMusicList" :key="item.id" class="simi-item default overflow" @click="playMusic(item)">
                <el-image :src="item.album.blurPicUrl"></el-image>
                <div class="show-info">
                  <span>{{ item.name }}</span>
                  <span>-</span>
                  <span class="singer">{{ item.artists[0].name }}</span>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
import HomeNav from '@/views/Home/home-nav.vue'
import { useStore } from 'vuex'
import { watch, ref, onBeforeUnmount, onActivated, onDeactivated, defineEmits, computed } from 'vue'
import { playAndCommit } from '@/utils/plugins.js'
import LyricCmp from '@/components/lyric-cmp.vue'

// defineProps({
//   musicDetail: {
//     type: Object,
//     default: () => {
//       return {}
//     }
//   }
// })

const emits = defineEmits(['packUp'])

const needleDeg = ref(0) // needle  旋转角度
const discDeg = ref(0)
const timer = ref(null)

const store = useStore()
// const musicInfo = ref([])

const containerHeight = ref(0)

const domRef = ref()
onActivated(() => {
  const h = getComputedStyle(domRef.value, null).height
  // console.log(h)
  containerHeight.value = `calc(100% - 70px + ${h})`
})
onDeactivated(() => {
  containerHeight.value = 0
})

const musicInfo = computed(() => {
  return store.state.musicInfo
})

watch(
  () => store.state.isPlay,
  (newV) => {
    if (newV) {
      needleDeg.value = 10
      timer.value = setInterval(() => {
        discDeg.value += 0.2
      }, 10)
    } else {
      needleDeg.value = -15
      clearInterval(timer.value)
      timer.value = null
    }
  },
  {
    immediate: true
  }
)

// 触发父元素收起事件
const packUp = () => {
  emits('packUp')
}

const simiMusicList = ref([])
const getSimiMusicList = async (id) => {
  const { songs = [] } = await store.dispatch('getInfo', { path: `/simi/song?id=${id}` })
  simiMusicList.value = songs
  // console.log(songs)
}

const playMusic = (info) => {
  // store.dispatch('getMusicInfo', { musicInfo: info })
  // console.log(info)
  playAndCommit({ store, musicInfo: info })
}

watch(
  () => store.state.musicInfo.id,
  (newVal) => {
    // console.log(newVal)
    getSimiMusicList(newVal)
  },
  {
    immediate: true
  }
)

onBeforeUnmount(() => {
  clearInterval(timer.value)
  timer.value = null
})
</script>

<style lang="less" scope>
div.music-detail-content {
  position: absolute;
  bottom: 70px;
  width: 100% !important;
  box-sizing: border-box;
  height: 0;
  z-index: 888;
  background: #fff;
  transition: all 0.5s;
  overflow: hidden;

  div.music-detail__content {
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 222, 0.3) 0, rgba(0, 0, 0, 0) 100%);
  }
  .home-nav {
    background: transparent !important;
  }
  .el-row.content {
    height: calc(100% - 70px);
    .el-col.left {
      position: relative;
      .flex(center,center);
      div.disc-c {
        background-image: url(~@/static/disc.png);
        background-size: 110% 110%;
        background-position: center center;
        height: 200px;
        width: 200px;
        border: 10px solid rgba(82, 79, 79, 0.15);
        border-radius: 50%;
        .flex(center,center);
        overflow: hidden;
        & > .el-image {
          height: 134px;
          width: 134px;
          border-radius: 50%;
        }
      }
      div.needle {
        background-image: url(~@/static/needle.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 125px;
        width: 85px;
        position: absolute;
        left: 50%;
        top: 20px;
        transform-origin: 10px 0;
        transition: transform 0.5s ease-in-out;
        &::before {
          content: '';
          background: #fff;
          width: 22px;
          height: 22px;
          padding: 5px;
          box-sizing: border-box;
          position: absolute;
          top: -11px;
          left: 6px;
          z-index: 11;
          border-radius: 50%;
        }
        span {
          position: absolute;
          height: 32px;
          width: 32px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          left: 1px;
          transform: translateY(-50%);
        }
      }
    }
    .el-col.lyric {
      height: 100%;
      // display:flex;

      .flex(flex-start,center);
      flex-direction: column;
      div.show-musicInfo {
        margin-left: 30px;
        text-align: center;
        margin-bottom: 15px;
        h3.name {
          margin: 10px;
        }
        p.singer {
          color: @singerColor;
        }
      }
      div.lyric-content {
        height: 280px;
        overflow-y: auto;
        width: 90%;
        position: relative;
        transition: all 0.5s ease-in-out;
        &::-webkit-scrollbar {
          display: none;
        }
        ul {
          // position: absolute;
          width: 100%;
          transition: all 0.5s ease-in-out;
          // overflow: hidden;
          // height: 1111px;
          li {
            display: flex;
            .flex(space-between,center);
            margin: 10px 0;
            box-sizing: border-box;
            font-size: 14px;
            &.current {
              padding: 15px;
              font-size: 16px;
              font-weight: bolder;
              color: @bgColor;
            }
            &:hover {
              span.hidden,
              span.play-icon {
                visibility: visible;
              }
            }
            span {
              &.lyric {
                width: calc(100% - 45px);
                text-align: center;
                flex: 1 1 auto;
              }
              &.hidden,
              &.play-icon {
                width: 45px;
                font-size: 12px;
                flex: 0 0 auto;
                visibility: hidden;
                color: #888;
              }
              &.play-icon {
                width: 20px;
              }
            }
          }
        }
      }
    }

    .el-col.similar-container {
      .flex(center,center);
      padding: 60px 35px 20px 20px;
      box-sizing: border-box;
      div.similar {
        height: 100%;
        overflow: auto;
        width: 100%;
        div.simi-title {
          font-size: 20px;
          font-weight: bolder;
          margin: 5px 0;
        }
        div.simi-item {
          height: 40px;
          padding: 5px;
          box-sizing: border-box;
          .flex(flex-start,center);
          border-radius: 5px;
          &:hover {
            background: rgba(0, 0, 0, 0.1);
          }
          .el-image {
            flex: 0 0 auto;
            height: 100%;
            width: 30px;
          }
          div.show-info {
            width: calc(100% - 30px);
            flex: 0 0 auto;
            padding-left: 10px;
            span.singer {
              color: @singerColor;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
