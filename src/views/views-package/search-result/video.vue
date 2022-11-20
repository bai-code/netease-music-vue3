<template>
  <div class="video" ref="domRef">
    <el-row class="video" type="flex" v-loading="isLoading">
      <el-col :span="8" v-for="video in showVideoList" :key="video.id">
        <ShowMvItem :mvInfo="video" :textOverflow="true">
          <template #duration>
            <div class="duration">
              <span>{{ video.durationTime }}</span>
            </div>
          </template>
        </ShowMvItem>
      </el-col>
    </el-row>
    <div class="pagination" v-if="videoList.length > 0">
      <el-pagination background layout="prev, pager, next" :total="total" v-model:page-size="pagesize" v-model:current-page="currentPage" @current-change="currentChange" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch, defineExpose, reactive, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import ShowMvItem from '@/components/show-mv-item.vue'
import { loopFilterAdd } from '@/utils/plugins.js'

const props = defineProps({
  searchText: {
    type: String
  }
})

const store = useStore()
const domRef = ref()
const isLoading = ref(false)

const showCount = ref('') // 父级展示数据
const total = ref(100)
const videoList = reactive([])
const showVideoList = ref([])
const pagesize = ref(24) // 每页数量
const currentPage = ref(1) // 当前页
const getVideoList = async (val) => {
  const len = videoList.length
  const start = (currentPage.value - 1) * pagesize.value
  if (isLoading.value) return
  isLoading.value = true
  if (videoList[start]) {
    nextTick(() => {
      showVideoList.value = videoList.slice(start, start + pagesize.value)
      isLoading.value = false
    })

    return
  }

  const txt = val || props.searchText
  const { result: { videoCount, videos = [] } = {} } = await store.dispatch('getInfo', { path: `/cloudsearch?keywords=${txt}&type=1014&limit=${pagesize.value}&offset=${start}` })
  const newList = loopFilterAdd({ musicList: videos, artists: 'creator', params: 'userName', transTime: true, timeName: 'durationms', isTransPlayCount: true, readPlayCountName: 'playTime' })
  if (len < videoCount && videoCount) {
    videoList.push(...new Array(videoCount))
    showCount.value = videoCount + '个视频'
    total.value = videoCount
  }
  showVideoList.value = newList
  videoList.splice(start, pagesize.value, ...newList)
  isLoading.value = false
  // console.log(newList, videoCount)
}

watch(
  () => props.searchText,
  (txt) => {
    if (!txt) return
    getVideoList(txt)
  },
  { immediate: true }
)

const currentChange = (index) => {
  currentPage.value = index
  showVideoList.value = []
  getVideoList()
  domRef.value.scrollTop = 0
}

defineExpose({
  showCount
})
</script>

<style lang="less" scoped>
.el-row.video {
  min-height: 200px;
  div.duration {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 24px;
    background: linear-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.3) 100%);
    color: #fff;
    padding: 0 10px;
    box-sizing: border-box;
    .flex(flex-end, center);
  }
}
div.pagination {
  .flex(center,center);
  .el-pagination {
    :deep(.is-active.number) {
      background-color: @bgColor;
    }
  }
}
</style>
