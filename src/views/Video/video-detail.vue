<template>
  <div class="video-detail">
    <el-scrollbar>
      <ShowVideoInfo :videoInfo="videoInfo" :videoSrc="videoSrc" :recommendVideoList="recommendVideoList" :hotCommentList="hotCommentList" :commentList="commentList" :isMv="isMv" />
    </el-scrollbar>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ShowVideoInfo from '@/components/show-video-info.vue'
import { loopFilterAdd, jointSinger, computedCount } from '@/utils/plugins.js'

const routes = useRoute()
const store = useStore()

const isMv = ref(false)

// 视频资源获取区域
const videoInfo = ref({})
const getVideoDetail = async (vid) => {
  const path = isMv.value ? `/mv/detail?mvid=${vid}` : `/video/detail?id=${vid}`
  const { data } = await store.dispatch('getInfo', { path })
  if (isMv.value && data.artists) {
    data.mvCreator = jointSinger(data.artists)
  }
  data._playCount = computedCount(data.playCount)
  videoInfo.value = data || {}
  // console.log(data)
}
// 获取视频播放地址
const videoSrc = ref('')
const getVideoSrc = async (vid) => {
  const path = isMv.value ? `/mv/url?id=${vid}` : `/video/url?id=${vid}`
  const url = await store.dispatch('getInfo', { path })
  // const { urls = [], code } = await store.dispatch('getInfo', { path })
  if (url.code === 200) {
    if (isMv.value) {
      videoSrc.value = url.data.url
    } else {
      videoSrc.value = url.urls[0] && url.urls[0].url
    }
  }
  // console.log(code, urls, videoSrc)
}

const commentList = ref([])
const hotCommentList = ref([])
const totalNum = ref(100)
const getCommentData = async (vid) => {
  const path = isMv.value ? `/comment/mv?id=${vid}` : `/comment/video?id=${vid}`
  const { comments = [], hotComments = [], total } = await store.dispatch('getInfo', { path })
  commentList.value = comments
  hotCommentList.value = hotComments
  totalNum.value = total
  // console.log(comments, hotComments, totalNum, res)
  // console.log(totalNum, res)
}

const recommendVideoList = ref([])
const getRecommendVideo = async (vid) => {
  const path = isMv.value ? `/simi/mv?mvid=${vid}` : `/related/allvideo?id=${vid}`
  const val = isMv.value ? 'mvs' : 'data'
  const recommendList = await store.dispatch('getInfo', { path })
  if (recommendList.code === 200) {
    const transAfterList = loopFilterAdd({ musicList: recommendList[val], isTransPlayCount: true, transTime: true, timeName: isMv.value ? 'duration' : 'durationms' })
    recommendVideoList.value = transAfterList
    // console.log(recommendList)
  }
}

// 监听 视频
watch(
  () => routes.query,
  (query = {}) => {
    const { vid, mvid } = query
    if (!vid && !mvid) return
    const id = vid || mvid
    if (vid) {
      isMv.value = false
    } else {
      isMv.value = true
    }
    getVideoDetail(id)
    getVideoSrc(id)
    getCommentData(id)
    getRecommendVideo(id)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="less" scoped>
div.video-detail {
  padding: 10px 20px;
  box-sizing: border-box;
  height: calc(100% - 60px);
  width: 100%;
}
</style>
