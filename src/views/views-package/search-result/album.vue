<template>
  <div class="album">
    <MusicListTable
      :showMusicList="showAlbumList"
      :isShowHeader="false"
      :showImage="true"
      :showImageIcon="false"
      sortOrder="image,album,singer"
      :addSingerAlias="true"
      :showAlbum="false"
      @linkToAlbum="linkToAlbum"
    />
  </div>
  <div class="pagination" v-if="albumList.length > 0">
    <el-pagination background layout="prev, pager, next" :total="total" v-model:page-size="pagesize" v-model:current-page="currentPage" @current-change="currentChange" />
  </div>
</template>
<script setup>
import { ref, defineProps, watch, defineExpose } from 'vue'
import { useStore } from 'vuex'
import MusicListTable from '@/components/music-list-table'
import { loopFilterAdd } from '@/utils/plugins.js'
import { useRouter } from 'vue-router'

const props = defineProps({
  searchText: {
    type: String
  }
})

const store = useStore()

const pagesize = ref(20) // 每页显示数量
const albumList = ref([]) // 专辑数组
const showAlbumList = ref([])
const showCount = ref('') // 返回父级数据
const total = ref(100) // 总数数量
const isLoading = ref(false)
const currentPage = ref(1) // 当前页数
const getAlbumList = async (val) => {
  const len = albumList.value.length
  const start = (currentPage.value - 1) * pagesize.value
  console.log(start)
  if (albumList.value[start]) {
    showAlbumList.value = albumList.value.slice(start, pagesize.value + start)
    return
  }
  if (isLoading.value) return
  isLoading.value = true
  const sVal = val || props.searchText
  const { result: { albumCount, albums = [] } = {} } = await store.dispatch('getInfo', { path: `/cloudsearch?keywords=${sVal}&type=10&limit=${pagesize.value}&offset=${start}` })
  showCount.value = albumCount + '张专辑'
  const newList = loopFilterAdd({ musicList: albums, addSingerAlias: true, artists: 'artist' })
  if (len !== total.value) {
    albumList.value = new Array(total.value)
  }
  if (albumCount) {
    total.value = albumCount
  }
  albumList.value.splice(start, pagesize.value, ...newList)
  showAlbumList.value = newList
  isLoading.value = false
  // console.log(albumList)
}

watch(
  () => props.searchText,
  (txt) => {
    if (!txt) return
    albumList.value.length = 0
    getAlbumList(txt)
  },
  { immediate: true }
)

const router = useRouter()
const linkToAlbum = (row) => {
  console.log(row)
  router.push({ name: 'song-list-package', params: { pId: row.id }, query: { isAlbum: true } })
}

const currentChange = (index) => {
  showAlbumList.value.length = 0
  currentPage.value = index
  getAlbumList()
}

defineExpose({
  showCount
})
</script>

<style lang="less" scoped>
div.album {
  min-height: 100px;
  :deep(.singer) {
    font-size: 12px;
  }
  div.loading {
    height: 40px;
    width: 100%;
  }
}
div.pagination {
  width: 100%;
  padding-bottom: 20px;
  .flex(center, center);
  .el-pagination {
    :deep(.is-active.number) {
      background-color: @bgColor;
    }
  }
}
</style>
