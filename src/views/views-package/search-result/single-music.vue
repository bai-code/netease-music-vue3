<template>
  <div class="single-list">
    <div class="btn">
      <div class="play-all pointer">
        <div class="play" @click="playMusic('all')">
          <i class="iconfont icon-hover"></i>
          <span class="text">播放全部</span>
        </div>
        <el-tooltip content="建设中..." placement="top-end">
          <div class="add">
            <i class="iconfont icon-add"></i>
          </div>
        </el-tooltip>
      </div>
      <el-tooltip content="建设中..." placement="top">
        <div class="collect pointer">
          <i class="iconfont icon-download"></i>
          <span class="c">下载全部</span>
        </div>
      </el-tooltip>
    </div>
    <div class="list">
      <MusicListTable :showMusicList="showList" />
      <div class="pagination" v-if="showList.length > 0">
        <el-pagination small background layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="currentChange" :current-page="currentPage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import MusicListTable from '@/components/music-list-table.vue'
import { reactive, ref, defineProps, watch, defineExpose } from 'vue'
import { loopFilterAdd, playAndCommit } from '@/utils/plugins.js'
import { useStore } from 'vuex'

const props = defineProps({
  searchText: {
    // 搜索内容
    type: String,
    defualt: ''
  }
})

const pageSize = ref(100) // 每页条目数
const singleList = reactive([]) // 总列表
const showList = ref([]) // 需要展示的数组
const total = ref(100) // 总数
const showCount = ref('') // 需要在父级展示的数据
const currentPage = ref(1) // 当前第几页

const store = useStore()

const getMusicList = async (txt) => {
  const len = singleList.length
  const start = (currentPage.value - 1) * pageSize.value // 起始
  if (len > start && singleList[start]) {
    showList.value = singleList.slice(start, start + pageSize.value)
  } else {
    const { result: { songs, songCount } = {} } = await store.dispatch('getInfo', { path: `/cloudsearch?keywords=${txt}&type=1&offset=${start}&limit=${pageSize.value}` })
    const newList = loopFilterAdd({ musicList: songs, transTime: true })
    if (len === 0) {
      singleList.push(...new Array(songCount))
    }
    singleList.splice(start, pageSize.value, ...newList)
    showList.value = songs
    total.value = songCount
    showCount.value = songCount + '首单曲'
    // console.log(singleList, songCount, start)
  }
}

const currentChange = (index) => {
  currentPage.value = index
  getMusicList(props.searchText)
  console.log(index)
}

watch(
  () => props.searchText,
  (txt) => {
    if (!txt) return
    getMusicList(txt)
  },
  { immediate: true }
)

const playMusic = () => {
  playAndCommit({ musicList: showList.value, index: 0 })
}

defineExpose({
  showCount
})
</script>

<style lang="less" scoped>
div.single-list {
  div.btn {
    .flex(flex-start, center);
    margin-bottom: 20px;
    div.play-all {
      .flex(flex-start,center);
      color: #fff;
      div.play {
        padding: 6px 10px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        background: @bgColor;
        &:hover {
          opacity: 0.9;
        }
        span.text {
          margin-left: 5px;
        }
      }
      div.add {
        flex: 1 1 auto;
        text-align: center;
        background: @bgColor;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        padding: 6px 10px 6px 6px;
        &:hover {
          opacity: 0.9;
        }
      }
    }
    div.collect {
      border-radius: 20px;
      padding: 5px 10px;
      border: 1px solid #ccc;
      margin-left: 15px;
      span.c {
        margin-left: 5px;
      }
    }
  }
  div.list {
    div.pagination {
      .flex(center,center);
      padding-bottom: 20px;
      :deep(.is-active) {
        background: @bgColor;
      }
    }
  }
}
</style>
