<template>
  <div class="song-list">
    <div class="scroll-effect" ref="domRef"></div>
    <div class="show-image pointer" v-if="showTitleInfo">
      <div class="show-blur" :style="{ backgroundImage: `url(${showTitleInfo.coverImgUrl})` }">展示失焦</div>
      <img :src="showTitleInfo.coverImgUrl" alt="" />
      <div class="show-info">
        <div class="icon-title">
          <i class="iconfont icon-vip"></i>
          <span>精品歌单</span>
        </div>
        <p class="name overflow">{{ showTitleInfo.name }}</p>
      </div>
    </div>

    <div class="show-tags">
      <div class="tags-left">
        <span class="btn">{{ btnText }}</span>
        <i class="iconfont icon-arrow-right"></i>
      </div>
      <ul class="tags-right">
        <li v-for="(tag, index) in tagList" :key="tag.id" class="pointer" @click="changeSelectItem(index)" :class="{ active: activeIndex === index }">{{ tag.name }}</li>
      </ul>
    </div>

    <div class="show-music-list">
      <ShowMusicInfo v-for="list in showMusicList" :key="list.id" :musicInfo="list" showImgName="coverImgUrl" imgWH="22%" />
    </div>
    <div class="pagination" v-show="isShow">
      <el-pagination layout="prev, pager, next" :total="total" @current-change="currentChange" :page-count="pagecount" :current-page="currentPage" />
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { onMounted, ref, reactive, computed } from 'vue'
import ShowMusicInfo from '@/components/show-music-info.vue'

const store = useStore()
const activeIndex = ref(0) // 歌曲分类 （index）
const currentPage = ref(0) // 当前页码
const showMusicList = ref([]) // 需要展现的数组
const pagesize = ref(10) // 每页显示个数
const total = ref(0) // 总计
const domRef = ref()
const isShow = ref(false)

const tagList = reactive([])
async function getTagsList() {
  const { tags = [] } = await store.dispatch('getInfo', { path: '/playlist/hot' })
  tagList.push(...tags)
  console.log(tagList)
}

const showTitleInfo = ref({})
const songList = reactive([])

async function getSongTitleInfo(cate) {
  const { playlists = [{}] } = await store.dispatch('getInfo', { path: `/top/playlist/highquality?cat=${cate}&limit=10` })
  // 服务器请求数据返回不规律 筛选一下
  const filterResult = playlists.find((item) => {
    return item.tag.indexOf(cate) >= 0
  })
  // console.log(filterResult, playlists)
  showTitleInfo.value = filterResult
}

async function getSongList(cate, offset) {
  const len = songList[activeIndex.value] && songList[activeIndex.value].length
  const start = offset * pagesize.value
  console.log(len, start)
  // 如果需要的数据 在 songlist 范围内，或者总数数量去掉开始值 小于 每页数量 都不用请求
  if (len > start || (total.value && total.value <= start + pagesize.value)) {
    showMusicList.value = songList[activeIndex.value].slice(start, start + pagesize.value)
    return
  }
  console.log(len, start)
  // isShow.value = false
  const res = await store.dispatch('getInfo', { path: `/top/playlist?cat=${cate}&limit=${pagesize.value}&offset=${start}` })
  if (res && res.playlists) {
    console.log(songList[activeIndex.value])
    if (!songList[activeIndex.value]) {
      songList[activeIndex.value] = []
      total.value = res.total
    }
    songList[activeIndex.value].push(...res.playlists)
    showMusicList.value = res.playlists
    isShow.value = true
    console.log(res, len, total)
  }
}

const changeSelectItem = (index) => {
  activeIndex.value = index
  currentPage.value = 0
  getSongTitleInfo(btnText.value)
  currentChange(1)
  // getSongList(btnText.value, 0)
}

// 改变页码
const currentChange = (index) => {
  currentPage.value = index
  getSongList(btnText.value, index - 1)
  domRef.value.scrollIntoView(true)
  console.log(currentPage.value)
}

const btnText = computed(() => {
  if (tagList.length === 0) return ''
  const tagName = tagList[activeIndex.value].name
  return tagName
})

const pagecount = computed(() => {
  return Math.floor(total.value / pagesize.value)
})

onMounted(() => {
  changeSelectItem(0)
  getTagsList()
})
</script>
<style lang="less" scoped>
div.song-list {
  // font-size: 14px;
  position: relative;
  div.scroll-effect {
    position: absolute;
    z-index: -1;
    height: 100%;
    top: -100px;
  }
  div.show-image {
    height: 170px;
    border-radius: 5px;
    padding-left: 15px;
    position: relative;
    .flex(flex-start,center);
    overflow: hidden;
    div.show-blur {
      position: absolute;
      height: 100%;
      width: 100%;
      // background-size: 100% 100%;
      left: 0;
      z-index: 1;
      filter: blur(27px);
    }
    img {
      position: relative;
      z-index: 99;
      height: 140px;
      width: 140px;
      border-radius: 5px;
      margin-right: 10px;
    }
    div.show-info {
      position: relative;
      z-index: 99;
      flex: 0 0 auto;
      width: calc(100% - 200px);
      div.icon-title {
        border: 1px solid @gold;
        width: 100px;
        height: 30px;
        line-height: 30px;
        border-radius: 30px;
        color: @gold;
        .flex(center,center);
        i.iconfont {
          margin-right: 5px;
        }
      }
      p {
        color: @contrastColor;
        font-size: 16px;
      }
    }
  }

  div.show-tags {
    .flex(space-between,center);
    height: 30px;
    margin: 20px 0;
    div.tags-left {
      border-radius: 30px;
      border: 1px solid @borderColor;
      line-height: 30px;
      width: 100px;
      text-align: center;
      i.iconfont {
        margin-left: 10px;
        color: rgb(114, 114, 114) !important;
      }
    }
    ul.tags-right {
      .flex(flex-start, center);
      flex-direction: row;
      li {
        font-size: 12px;
        margin-left: 10px;
        &.active {
          color: @bgColor;
        }
      }
    }
  }

  div.show-music-list {
    .flex(space-between,flex-start);
    flex-wrap: wrap;
  }
  div.pagination {
    .flex(center, center);
  }
}
</style>
