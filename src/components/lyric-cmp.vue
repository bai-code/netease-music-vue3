<template>
  <div class="lyric-cmp">
    <slot name="musicInfo">
      <div class="show-musicInfo">
        <h3 class="name">{{ musicInfo.name }}</h3>
        <p class="singer">{{ musicInfo.singer }}</p>
      </div>
    </slot>
    <div class="lyric-content" ref="domContainerRef">
      <ul :style="{ top: scrollTop }" v-if="lyricList.length">
        <li v-for="(lyric, index) in lyricList" :key="index" ref="lyricRef" class="default">
          <span v-for="(item, i) in lyric" :key="i" :class="{ lyric: i === 1, hidden: i === 0 }">{{ item }}</span>
          <span class="play-icon pointer" @click="seekPlayTime(lyric[0])">
            <i class="iconfont icon-hover"></i>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  musicInfo: {
    type: Object
  }
})

const store = useStore()

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
  props.musicInfo,
  (musicInfo) => {
    if (musicInfo) {
      const { id } = musicInfo
      getMusicLyric(id)
    }
  },
  { immediate: true }
)

const isPlay = computed(() => {
  return store.state.isPlay
})

const domContainerRef = ref()
const lyricRef = ref([])
const scrollTop = ref(0)

watch(
  () => store.getters.setCurrentTime,
  (newVal) => {
    lyricList.value.forEach((item, index) => {
      if (newVal === item[0]) {
        lyricRef.value.forEach((i) => {
          if (i.className.indexOf('current') !== -1) {
            i.classList.remove('current')
          }
        })
        // lyricRef.value[index - 1].classList.remove('current')
        const top = lyricRef.value[index].offsetTop - 140
        domContainerRef.value.scrollTop = top < 0 ? 0 : top
        lyricRef.value[index].classList.add('current')
      }
    })
  }
)

const seekPlayTime = (time) => {
  const t = time.split(':')
  const m = parseInt(t[0]) * 60
  const s = parseInt(t[1])
  const pm = props.musicInfo.time / 1000
  // 判断有歌词中时间超过歌曲总时间 => 跳到歌曲结束
  if (pm < m + s) {
    store.commit('seekTime', { time: pm })
    return
  }
  store.commit('seekTime', { time: m + s })
  lyricRef.value.forEach((item) => {
    item.classList.remove('current')
  })
  if (!isPlay.value) {
    store.commit('play')
  }
}

onMounted(() => {
  if (!lyricRef.value.length) {
    return
  }
  console.log(lyricRef.value)
  lyricRef.value[1].classList.add('current')
})
</script>

<style lang="less" scoped>
div.lyric-cmp {
  height: 100%;
  margin-top: 40px;
  width: 100%;
  // flex: 0 0 auto;
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
</style>
