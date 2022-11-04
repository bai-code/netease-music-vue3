<template>
  <el-carousel v-if="bannerList.length" :interval="4000" type="card" height="200px" :initial-index="0">
    <el-carousel-item v-for="banner in bannerList" :key="banner.targetId" @click="playMusic(banner)">
      <img :src="banner.imageUrl" :alt="banner.typeTitle" />
      <span class="mark" :style="{ backgroundColor: banner.titleColor }">{{ banner.typeTitle }}</span>
    </el-carousel-item>
  </el-carousel>
  <!-- 推荐音乐 -->
  <div class="recommend-music">
    <NavTitle titleText="推荐音乐" />
    <div class="container">
      <ShowMusicInfo :musicInfo="todayInfo" imgWH="18%">
        <template #date-re>
          <span class="today">{{ today }}</span>
        </template>
      </ShowMusicInfo>
      <ShowMusicInfo v-for="item in recommendList" :key="item.id" :musicInfo="item" imgWH="18%" />
    </div>
  </div>

  <!-- 独家放送 -->
  <div class="exclusive">
    <NavTitle titleText="独家放送" @linkPage="linkPage('exclusive')" />
    <ul class="exclusive-container" ref="containerRef">
      <li v-for="item in privatecontent" :key="item.id">
        <ExclusiveTemplate :videoInfo="item" />
      </li>
    </ul>
  </div>

  <!-- 推荐mv -->
  <div class="recommend-mv">
    <NavTitle titleText="推荐MV" @linkPage="linkPage('')" />
    <div class="mv-container">
      <ShowMvItem :mvInfo="mv" v-for="mv in mvList" :key="mv.id"  :needHover="true" />
    </div>
  </div>

  <!-- 新歌推荐 -->
  <div class="new-songs">
    <NavTitle titleText="最新音乐" @linkPage="linkPage('latest-music')" />
    <div class="container">
      <show-music-info-s v-for="song in newSongList" :key="song.id" :musicInfo="song" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import NavTitle from '@/components/nav-title.vue'
import ShowMusicInfo from '@/components/show-music-info.vue'
import datePng from '@/static/tempDateBg.png'
import ShowMusicInfoS from '@/components/show-music-info-s.vue'
import ShowMvItem from '@/components/show-mv-item.vue'
import { loopFilterAdd, playAndCommit } from '@/utils/plugins.js'
import { useRouter } from 'vue-router'
import ExclusiveTemplate from '@/components/exclusive-template.vue'

const containerRef = ref()
const store = useStore()
// 获取banner数据
const bannerList = ref([])
async function requestBannerList() {
  const { banners } = await store.dispatch('getInfo', { path: '/banner' })
  bannerList.value = banners
  // console.log(banners)
}

// 获取热门推荐
const recommendList = ref([])
async function requestRecommendList() {
  const { result } = await store.dispatch('getInfo', { path: '/personalized?limit=9' })
  recommendList.value = result
  // console.log(result)
}

const todayInfo = {
  name: '每日歌曲推荐',
  picUrl: datePng
}

const today = new Date().getDate()

// 独家放送请求数据
const privatecontent = ref([])
const loading = ref(true)
async function getprivatecontent() {
  const { result } = await store.dispatch('getInfo', { path: '/personalized/privatecontent' })
  privatecontent.value = result
  loading.value = false
  // console.log(privatecontent)
}

// const playExclusive = (item) => {
//   if (item.id) {
//     router.push({ name: 'video-detail', query: { mvid: item.id } })
//   }
//   // console.log(item)
// }

// 计算图片原始尺寸对应高度
// const domH = computed(() => {
//   const domW = containerRef.value.offsetWidth * 0.33
//   return parseInt((399 * domW) / 1080) + 30 + 'px'
// })

const mvList = ref([])
async function getMVList() {
  const { result } = await store.dispatch('getInfo', { path: '/personalized/mv' })
  const filterList = result.splice(0, 3)
  mvList.value = loopFilterAdd({ musicList: filterList, str: 'author' })
  // console.log(mvList.value)
  // console.log(result)
}

const newSongList = ref()
async function getNewSongList() {
  const { result = [] } = await store.dispatch('getInfo', { path: '/personalized/newsong?limit=12' })
  const res = loopFilterAdd({ musicList: result, value: 'song' })
  // console.log(res)
  newSongList.value = res
  // console.log(result)
}
const router = useRouter()
const playMusic = async (info) => {
  if (info.url) {
    // 外链跳转
    window.open(info.url, '_blank')
  } else {
    if (info.targetType === 1) {
      // 播放单首歌曲
      const { songs = [] } = await store.dispatch('getInfo', { path: `/song/detail?ids=${info.targetId}` })
      playAndCommit({ store, musicInfo: songs[0] })
    } else if (info.targetType === 1000) {
      // 歌单
      router.push({ name: 'music-list', params: { id: info.targetId }, query: { argu: 'playlist' } })
    } else {
      // 新碟首发  数字专辑
      router.push({ name: 'music-list', params: { id: info.targetId } })
    }
  }
  console.log(info)
}

const linkPage = (name) => {
  router.push({ name })
}

// const playMv = (info) => {
//   router.push({ name: 'video-detail', query: { mvid: info.id } })
//   console.log(info)
// }

onMounted(() => {
  requestBannerList()
  requestRecommendList()
  getprivatecontent()
  getNewSongList()
  getMVList()
})
</script>

<style lang="less" scoped>
.el-carousel {
  .el-carousel__item {
    overflow: hidden;
    border-radius: 5px;
    img {
      height: 100%;
      width: 100%;
    }
    span.mark {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 3px 13px;
      font-size: 14px;
      color: @contrastColor;
      border-top-left-radius: 10px;
    }
  }
}

div.recommend-music {
  div.container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    span.today {
      .positions(50%,50%);
      transform: translate(-50%, -50%+5);
      font-size: 24px;
      color: @contrastColor;
    }
  }
}

// 独家放送
div.exclusive {
  ul.exclusive-container {
    .flex(space-between,flex-start);
    & > li {
      width: 32%;
      :deep(div.image) {
        width: 100%;
        // height: 140px;
      }
    }
  }
  // div.default-content {
  //   position: relative;
  //   img {
  //     width: 100%;
  //     border-radius: 5px;
  //   }
  //   p.text {
  //     font-size: 14px;
  //     .overflowMul(3);
  //   }
  //   & > span {
  //     position: absolute;
  //     left: 10px;
  //     top: 8px;
  //     height: 25px;
  //     width: 25px;
  //     .flex(center,center);
  //     color: #fff;
  //     background: rgba(70, 70, 70, 0.4);
  //     border-radius: 50%;
  //     i.iconfont {
  //       font-size: 12px;
  //     }
  //   }
  // }
}

div.recommend-mv {
  div.mv-container {
    .flex(space-between,space-between);
    .show-mv-list {
      width: 32%;
    }
  }
}

div.new-songs {
  & > div.container {
    .flex(space-between,flex-start);
    flex-wrap: wrap;
    .show-music-info-s {
      width: 32%;
    }
  }
}
</style>
