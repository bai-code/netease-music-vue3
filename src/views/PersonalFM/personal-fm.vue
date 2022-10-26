<template>
  <el-scrollbar>
    <el-row class="personal-fm" v-if="showFm.name">
      <el-col :span="11" class="image">
        <div class="image-container">
          <ul class="img-c">
            <TransitionGroup name="image" mode="in-out">
              <template v-for="(fm, index) in personalFmList" :key="fm.id">
                <li class="img-i" v-show="fm && fm.album && currentIndex === index" :class="{ next: index === currentIndex + 1, prev: index === currentIndex - 1 }">
                  <el-image fit="fill" :src="fm.album.blurPicUrl"></el-image>
                </li>
              </template>
            </TransitionGroup>
          </ul>

          <div :class="[isPlay ? 'right-bottom' : 'center', 'play-icon pointer']">
            <i class="iconfont icon-hover" v-show="!isPlay" @click="playMusic('play')"></i>
            <i class="iconfont icon-pause" v-show="isPlay" @click="playMusic('pause')"></i>
          </div>
        </div>
        <div class="controls">
          <span class="delete pointer" @click="deleteFm">
            <i class="iconfont icon-delete"></i>
          </span>
          <span class="play-next pointer" @click="playNext">
            <i class="iconfont icon-next" :class="{ disabled: isLoading }"></i>
          </span>
        </div>
      </el-col>
      <el-col :span="12" :push="1" class="lyric">
        <el-row class="musicInfo">
          <el-col class="music-name">
            <h2 class="overflow">
              {{ showFm.name }}
            </h2>
          </el-col>
          <el-row class="info" v-if="showFm.album">
            <el-col class="album overflow" :span="11">
              专辑：<span class="pointer" :title="showFm.album.name">{{ showFm.album.name }}</span>
            </el-col>
            <el-col class="singer overflow" :span="11" :offset="1"
              >歌手：<span class="s pointer">{{ showFm.artists[0].name }}</span>
            </el-col>
          </el-row>
          <div class="lyric">
            <LyricCmp :musicInfo="musicInfo">
              <template #musicInfo><span></span> </template>
            </LyricCmp>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { playAndCommit } from '@/utils/plugins.js'
import { ElMessage } from 'element-plus'
import LyricCmp from '@/components/lyric-cmp.vue'

export default defineComponent({
  components: {
    LyricCmp
  },
  setup() {
    const currentIndex = ref(0)
    // const offset = ref(0)
    const store = useStore()
    // const personalFmList = reactive([])
    const isFirstEnter = ref(true)
    const isLoading = ref(false)
    // 获取播放状态
    const isPlay = computed(() => {
      return store.state.isPlay
    })

    defineComponent({
      LyricCmp
    })

    const personalFmList = computed(() => {
      return store.state.personalFm.personalFmList
    })

    const showFm = ref([]) // 展示当前播放信息

    const isClick = computed(() => {
      return store.state.isClick
    })

    watch(
      personalFmList,
      (list = []) => {
        if (list.length === 3) {
          currentIndex.value = 1
        } else {
          currentIndex.value = 0
        }
        showFm.value = list[currentIndex.value] || {}
        if (list.length === 0) return
        console.log('提交请求')
        playAndCommit({ store, musicInfo: showFm.value, isPlay: isClick.value, isFm: true })
      },
      { immediate: true, deep: true }
    )

    const getFm = async () => {
      isLoading.value = true
      await store.dispatch('personalFm/getFm')
      isLoading.value = false
      // console.log(personalFmList, offset.value)
    }

    const musicInfo = computed(() => {
      return store.state.musicInfo
    })

    const playNext = async () => {
      if (isLoading.value) return
      // let index = currentIndex.value
      isFirstEnter.value = false
      await getFm()
      // index += 1
      // if (index >= 1) {
      //   currentIndex.value = 1
      // } else {
      //   currentIndex.value = index
      // }
    }

    const playMusic = (params) => {
      if (params === 'play') {
        store.commit('play')
      } else {
        store.commit('pause')
      }
      isFirstEnter.value = false
    }

    const deleteFm = async () => {
      if (isLoading.value) return
      isLoading.value = true
      const { id } = showFm.value
      const { code } = await store.dispatch('getInfo', { path: `/fm_trash?id=${id}` })
      ElMessage({
        type: code === 200 ? 'success' : 'error',
        message: code === 200 ? '删除成功' : '删除失败'
      })
      isLoading.value = false
      if (code === 200) {
        isFirstEnter.value = false
        playNext()
      }
    }

    onMounted(async () => {
      // 初始渲染，下一个用于加载图片
      await getFm()
      await getFm()
    })

    return {
      playNext,
      personalFmList,
      showFm,
      currentIndex,
      isPlay,
      playMusic,
      deleteFm,
      musicInfo,
      isLoading
    }
  },
  beforeRouteEnter(to, from, next) {
    const userinfo = JSON.parse(localStorage.getItem('userinfo')) || {}
    const token = userinfo.token
    if (token) {
      next()
    } else {
      next({ name: 'login' })
    }
  }
})
</script>

<style lang="less" scoped>
.el-row.personal-fm {
  .el-col.image {
    height: 380px;
    width: 300px;
    flex-direction: column;
    .flex(flex-end,center);
    div.image-container {
      position: relative;
      height: 300px;
      width: 300px;
      flex: 0 0 auto;
      overflow: hidden;
      .flex(center,center);
      ul.img-c {
        position: relative;
        height: 300px;
        width: inherit;
        flex: 0 0 auto;
        .flex(center,center);
        // .image-move, /* 对移动中的元素应用的过渡 */
        .image-enter-active,
        .image-leave-active {
          transition: all 0.5s ease-in;
        }
        .image-enter-from {
          opacity: 0;
          transform: translateX(320px);
        }
        .image-leave-to {
          transform: translateX(-320px);
          height: 50%;
          width: 50%;
          opacity: 0;
        }
        li.img-i {
          position: absolute;
          width: 300px;
          height: 300px;
          .flexCenter;
          .el-image {
            flex: 0 0 auto;
            height: inherit;
            width: inherit;
            border-radius: 5px;
            box-shadow: 0 0 5px #ccc;
          }
        }
      }
      div.play-icon {
        flex: 0 0 auto;
        height: 50px;
        width: 50px;
        position: absolute;
        .flex(center,center);
        transition: all 0.5s;
        left: 50%;
        top: 50%;
        &.right-bottom {
          transform: translate(180%, 180%);
          i.iconfont {
            height: 40px;
            width: 40px;
          }
        }
        &.center {
          transform: translate(-50%, -50%);
        }
        i.iconfont {
          font-size: 20px;
          color: @bgColor;
          height: 50px;
          width: 50px;
          background: #fff;
          font-weight: bolder;
          .flex(center,center);
          border-radius: 50%;
          transition: all 0.5s;
        }
      }
    }
    div.controls {
      width: 100%;
      margin-top: 10px;
      .flex(space-evenly,center);
      span.pointer {
        padding: 5px;
        i.iconfont {
          font-size: 20px;
          color: #555;
        }
      }
    }
  }
  .el-col.lyric {
    width: 100%;
    // flex:0 0 auto;
    .el-row.musicInfo {
      .el-row.info {
        font-size: 12px;
        width: 100%;
        .el-col.singer {
          span.s {
            color: #507daf;
          }
        }
      }
      div.lyric {
        width: 100%;
      }
    }
  }
}
</style>
