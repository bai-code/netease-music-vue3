<template>
  <nav-title-select :titleList="titleList" @changeIndex="changeIndex" :activeIndex="activeIndex"></nav-title-select>
  <TitleCategory :categoryList="categoryTagList" @changeCategory="changeCategory" :activeIndex="categoryActiveIndex">
    <template #left>
      <div class="show-text pointer">
        <span title="更新中......">{{ showBtnText }}</span>
        <i class="iconfont icon-arrow-right"></i>
      </div>
    </template>
  </TitleCategory>

  <div class="show-mv-list" v-if="videoList[categoryActiveIndex] && videoList[categoryActiveIndex].length">
    <el-row class="video-container" v-infinite-scroll="loadVideo" type="flex" :gutter="30" :infinite-scroll-distance="600" :infinite-scroll-immediate="true">
      <el-col :span="8" v-for="item in videoList[categoryActiveIndex]" :key="item.id">
        <ShowVideo :videoInfo="item" @playVideo="playVideo" />
      </el-col>

      <div class="show-loading-icon" v-loading="isLoading"></div>
    </el-row>
  </div>
  <div class="empty" v-else>暂无数据</div>
</template>

<script setup>
import { shallowReactive, ref, onMounted, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import NavTitleSelect from '@/components/nav-title-select.vue'
import TitleCategory from '@/components/title-category.vue'
import ShowVideo from '@/components/show-video.vue'
import { transformTime } from '@/utils/plugins.js'

const titleList = shallowReactive([
  {
    id: 0,
    text: '视频'
  },
  {
    id: 1,
    text: 'MV'
  }
])

const activeIndex = ref(0)
const changeIndex = (index) => {
  activeIndex.value = index
}

const store = useStore()

// 一百多条
// const groupTagList = reactive([])
// const getVideoTagList = async () => {
//   const { data } = await store.dispatch('getInfo', { path: '/video/group/list' })
//   groupTagList.push(data)
//   console.log(groupTagList)
// }

const hasMore = ref(true)
const videoList = reactive([])
const isLoading = ref(false)
const getVideoList = async (id = '58100') => {
  if (!hasMore.value || isLoading.value) {
    return
  }
  const len = videoList[categoryActiveIndex.value].length
  isLoading.value = true
  const { hasmore, datas = [] } = await store.dispatch('getInfo', { path: `/video/group?id=${id}&offset=${len}` })
  console.log(datas)
  if (datas.length === 0) {
    isLoading.value = false
    return
  }
  datas.forEach((item) => {
    item.data.countTime = transformTime(item.data.durationms || item.data.duration)
  })

  videoList[categoryActiveIndex.value].push(...datas)
  hasMore.value = hasmore
  isLoading.value = false
  // console.log('切换', videoList)
}
// 子组件切换图片
const loadVideo = () => {
  getVideoList(videoId.value)
}

const showBtnText = computed(() => {
  if (categoryTagList.value.length === 0 || !categoryTagList.value[categoryActiveIndex.value]) return
  return categoryTagList.value[categoryActiveIndex.value].name
})

const videoId = computed(() => {
  if (categoryTagList.value.length === 0 || !categoryTagList.value[categoryActiveIndex.value]) return
  return categoryTagList.value[categoryActiveIndex.value].id
})

// 切换分类
const categoryActiveIndex = ref(0)
const changeCategory = (index) => {
  categoryActiveIndex.value = index
  hasMore.value = true
  // console.log(categoryTagList.value[categoryActiveIndex.value])
  if (!videoList[categoryActiveIndex.value]) {
    videoList[categoryActiveIndex.value] = []
    getVideoList(videoId.value)
    console.log('触发', videoId.value)
  }
}

// 九条数据
const categoryTagList = ref([])
const getVideoCategoryList = async () => {
  const { data = [] } = await store.dispatch('getInfo', { path: '/video/category/list' })
  categoryTagList.value = data
  console.log(categoryTagList.value)
}

const isMounted = ref(false) // 用于element-plus   load事件

onMounted(() => {
  // getVideoTagList()
  isMounted.value = true
  getVideoCategoryList()
  console.log('挂在')
  // getVideoList(videoId.value)
})

const router = useRouter()
const playVideo = (videoInfo) => {
  const vid = videoInfo.data.vid
  // console.log(videoInfo, vid)
  router.push({ name: 'video-list', query: { vid } })
}
</script>

<style lang="less" scoped>
div.show-text {
  padding: 5px 15px;
  border: 1px solid #ccc;
  border-radius: 30px;
  width: 80px;
  text-align: center;
  i.iconfont {
    font-size: 12px;
    margin-left: 5px;
  }
}

.el-row.video-container {
  flex-wrap: wrap;
  min-height: 40px;
  div.show-loading-icon {
    height: 30px;
    width: 100%;
    flex: 0 0 auto;
  }
}
</style>
