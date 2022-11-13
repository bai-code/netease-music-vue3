<template>
  <div class="show-music-info">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 160px; height: 160px" />
        <el-skeleton-item variant="text" style="margin-right: 16px" />
        <el-skeleton-item variant="text" style="width: 30%" />
      </template>
      <template #default>
        <div class="image pointer source">
          <div class="img" @click="playMusic">
            <img v-lazy="musicInfo[showImgName]" alt="" />
            <div class="play-count" v-if="musicInfo.playCount">
              <i class="iconfont icon-play1"></i>
              <span>{{ showPlayCount }}</span>
            </div>
            <div class="play-hover" v-else>根据您的音乐口味生成每日更新</div>
            <slot name="date-re"></slot>
            <div class="creator" v-if="musicInfo.creator">
              <i class="iconfont icon-renwu-ren"></i>
              <span class="nickname">{{ musicInfo.creator.nickname }}</span>
              <el-image v-if="musicInfo.creator.avatarDetail" :src="musicInfo.creator.avatarDetail.identityIconUrl"></el-image>
            </div>
          </div>

          <div class="play-icon" :class="{ 'right-bottom': iconPosition === 'right-bottom', center: iconPosition === 'center' }" @click="playOver">
            <i class="iconfont icon-hover"></i>
          </div>
        </div>
      </template>
    </el-skeleton>

    <p class="description pointer">{{ musicInfo.name }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getPlaylist } from '@/utils/plugins'
// import getPlaylist from '@/hooks/useGetPlaylist.vue'

const props = defineProps({
  musicInfo: {
    type: Object,
    reqiured: true,
    default: () => {
      return {}
    }
  },
  showImgName: {
    type: String,
    default: 'picUrl'
  },
  iconPosition: {
    // icon图标位置
    type: String,
    default: 'right-bottom'
  },
  isPlaylist: {
    // 区分是歌单还是每日歌曲
    type: Boolean,
    default: true
  }
})

// const emits = defineEmits(['playOver'])

const loading = ref(true)
const store = useStore()

watch(
  () => props.musicInfo,
  (newVal) => {
    if (newVal && newVal.name) {
      loading.value = false
    }
  },
  { immediate: true, deep: true }
)

const showPlayCount = computed(() => {
  const playCount = props.musicInfo.playCount
  if (playCount > 100000000) {
    return Math.floor(playCount / 100000000) + '亿'
  } else if (playCount > 10000) {
    return Math.floor(playCount / 10000) + '万'
  }
  return playCount
})

const router = useRouter()
const playMusic = () => {
  if (props.musicInfo.name === '每日歌曲推荐') {
    const { token } = store.state.userinfo.userInfo
    // 判断登录
    if (!token) {
      router.push({ name: 'login', query: { redirectTo: 'music-list', argu: 'daily' } })
    } else {
      router.push({ name: 'music-list', query: { argu: 'daily' } })
    }
  } else {
    const { id } = props.musicInfo
    if (props.isPlaylist) {
      router.push({ name: 'song-list-package', params: { pId: id } })
    } else {
      router.push({ name: 'music-list', params: { id }, query: { argu: 'playlist' } })
    }
  }
  console.log(props.musicInfo)
}

const playOver = () => {
  // 直接播放
  const { id } = props.musicInfo
  getPlaylist({ id, isPlay: true })
}
</script>

<style lang="less" scoped>
div.show-music-info {
  position: relative;
  width: 140px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  div.image {
    flex: 0 0 auto;
    width: 100%;
    height: 140px;
    flex: 0 0 auto;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    &:hover div.play-icon {
      opacity: 1;
    }
    &:hover div.play-hover {
      height: 55px;
      padding: 10px 5px;
    }
    img {
      height: 100%;
      width: 100%;
      border-radius: 5px;
    }
    div.play-count {
      position: absolute;
      width: 100%;
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: flex-end;
      background: linear-gradient(rgba(0, 0, 0, 0.3) 0, rgba(0, 0, 0, 0) 100%);
      top: 0;
      left: 0;
      color: @contrastColor;
      font-size: 12px;
      padding: 0 5px 0;
      box-sizing: border-box;
      i {
        font-size: inherit;
        margin-right: 5px;
      }
    }
    div.play-hover {
      position: absolute;
      top: 0;
      left: 0;
      color: @contrastColor;
      font-size: 12px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.3);
      line-height: 18px;
      height: 0;
      overflow: hidden;
      padding: 0 5px;
      transition: all 0.4s 0.5s;
    }
    div.play-icon {
      position: absolute;
      opacity: 0;
      height: 24%;
      width: 24%;
      background: #fff;
      border-radius: 50%;
      z-index: 11;
      .flex(center,center);
      transition: opacity 0.7s;
      &.right-bottom {
        right: 8%;
        bottom: 8%;
      }
      &.center {
        .posi(50%,50%);
      }
      & > i {
        color: @bgColor;
        font-size: 16px;
      }
    }
    div.creator {
      position: absolute;
      bottom: 0px;
      left: 0px;
      color: #fff;
      font-size: 12px;
      width: 100%;
      height: 40px;
      padding-left: 10px;
      box-sizing: border-box;
      line-height: 50px;
      // .flex(flex-start, center);
      background: linear-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.4) 100%);
      i.iconfont {
        font-size: 12px;
        margin-right: 5px;
      }
      span.nickname {
        text-shadow: 0 0 3px #888;
      }
      .el-image {
        height: 15px;
        width: 15px;
        border-radius: 50%;
        vertical-align: middle;
        margin-left: 5px;
      }
    }
  }
  p.description {
    flex: 0 0 auto;
    .overflowMul(2);
    font-size: 13px;
    line-height: 20px;
    margin: 8px 0 20px;
  }
}
</style>
