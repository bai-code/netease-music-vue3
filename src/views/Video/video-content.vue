<template>
  <div class="video-content" v-if="isMounted">
    <TitleCategory :categoryList="categoryTagList" @changeCategory="changeCategory" :activeIndex="categoryActiveIndex">
      <template #left>
        <div class="show-text pointer">
          <span title="更新中......">{{ showBtnText }}</span>
          <i class="iconfont icon-arrow-right"></i>
        </div>
      </template>
    </TitleCategory>
    <div v-if="isMounted">
      <div class="show-mv-list" v-infinite-scroll="loadVideo" :infinite-scroll-distance="300" :infinite-scroll-immediate="false">
        <el-row class="video-container" type="flex" v-if="videoList[categoryActiveIndex] && videoList[categoryActiveIndex].length && isMounted" :gutter="10">
          <el-col :span="8" v-for="item in videoList[categoryActiveIndex]" :key="item.id" class="video-item">
            <ShowVideoItem :videoInfo="item" @playVideo="playVideo" />
          </el-col>
          <div class="show-loading-icon" v-loading="isLoading"></div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch, onActivated, onDeactivated } from 'vue'
import TitleCategory from '@/components/title-category.vue'
import ShowVideoItem from '@/components/show-video-item.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { transformTime } from '@/utils/plugins.js'

const store = useStore()
const router = useRouter()

const hasMore = ref(true)
const videoList = reactive([])
const isLoading = ref(false)
const getVideoList = async (id = '58100') => {
  if (!hasMore.value || isLoading.value) {
    return
  }
  if (!videoList[categoryActiveIndex.value]) {
    videoList[categoryActiveIndex.value] = []
  }
  const len = videoList[categoryActiveIndex.value].length
  isLoading.value = true
  // const { hasmore, datas = [] } = await store.dispatch('getInfo', { path: `/video/group?id=${id}&offset=${len}` })
  // console.log(datas)
  const { datas = [], hasmore } = await store.dispatch('getInfo', { path: `/video/group?id=${id}&offset=${len}` })

  // console.log(datas, hasmore)

  // if (datas.length === 0) {
  //   isLoading.value = false
  //   return
  // }
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
  if (!videoList[categoryActiveIndex.value]) {
    videoList[categoryActiveIndex.value] = []
    getVideoList(videoId.value)
  }
}

// 九条数据
const categoryTagList = ref([])
const getVideoCategoryList = async () => {
  const { data = [] } = await store.dispatch('getInfo', { path: '/video/category/list' })
  if (data.length === 0) {
    ElMessage({
      type: 'error',
      message: '获取信息错误，请刷新试试！！！'
    })
    return
  }
  categoryTagList.value = data
  // console.log(categoryTagList.value)
}

// 当获取到列表触发一次
watch(categoryTagList, (newVal) => {
  const { id } = newVal[0]
  getVideoList(id)
})

const isMounted = ref(false) // 用于element-plus   load事件

onMounted(() => {
  // getVideoTagList()
  // isMounted.value = true
  getVideoCategoryList()
  // getVideoList(videoId.value)
})

const playVideo = (videoInfo) => {
  const vid = videoInfo.data.vid
  // console.log(videoInfo, vid)
  router.push({ name: 'video-detail', query: { vid } })
}

onActivated(() => {
  isMounted.value = true
})

onDeactivated(() => {
  isMounted.value = false
})
</script>

<style lang="less" scoped>
div.video-content {
  // overflow-y: hidden;
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
  div.show-mv-list {
    width: 100%;
    min-height: 700px;
    .el-row.video-container {
      min-height: 700px;
      flex-wrap: wrap;
      min-height: 40px;
      .el-col.video-item {
        padding: 0 10px;
        box-sizing: border-box;
      }
      div.show-loading-icon {
        height: 30px;
        width: 100%;
        flex: 0 0 auto;
      }
    }
  }
}
</style>
