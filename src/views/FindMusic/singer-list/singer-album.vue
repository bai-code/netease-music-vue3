<template>
  <div class="singer-album">
    <AlbumList :albumList="hotMusic" />
    <ul class="album-list" v-infinite-scroll="loadMore" :infinite-scroll-immediate="true" :infinite-scroll-distance="600" :infinite-scroll-disabled="isDisabled">
      <li v-for="album in showAlbumList" :key="album.id">
        <AlbumList :albumInfo="album" :albumList="album._list" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'
import { loopFilterAdd } from '@/utils/plugins.js'
import { useStore } from 'vuex'
import AlbumList from '@/components/album-list.vue'

const props = defineProps({
  singerId: {
    type: [Number, String]
  },
  hotAlbumList: {
    type: Array,
    default: () => []
  }
})

const store = useStore()
// 热门50首
const hotMusic = ref([])
const getSingerHotMusic = async (id) => {
  const { songs = [] } = await store.dispatch('getInfo', { path: `/artist/top/song?id=${id}` })
  hotMusic.value = loopFilterAdd({ musicList: songs, transTime: true, timeName: 'dt', artists: 'ar' })
  // console.log(songs)
}

const oldId = ref(0)
watch(
  () => props.singerId,
  (id) => {
    if (oldId.value === id && !id) return
    getSingerHotMusic(id)
    oldId.value = id
  },
  { immediate: true }
)

const loadIndex = ref(0) // 滚动到第几项
const showAlbumList = ref([]) // 存放专辑列表标题和列表
// const cacheList = ref([])
const isLoading = ref(false)
const isDisabled = ref(false) // 是否禁用滚动加载 （loadmore事件）

// 只需要获取几个属性，没必要使用loadsh 深度克隆
const _cloneProperty = (origin) => {
  const target = {}
  const config = {
    name: '',
    blurPicUrl: '',
    publishTime: '',
    id: ''
  }
  for (const prop in config) {
    target[prop] = origin[prop]
  }
  return target
}

// 启用 keep-alive  用于初始化
const initConfig = () => {
  loadIndex.value = 0
  showAlbumList.value = []
  isLoading.value = false
  isDisabled.value = false
}

watch(
  () => props.hotAlbumList,
  (list) => {
    if (list && list.length) {
      initConfig()
      showAlbumList.value[loadIndex.value] = _cloneProperty(list[loadIndex.value])
      getAlbumList(showAlbumList.value[loadIndex.value].id)
    }
  },
  { immediate: true, deep: true }
)

const getAlbumList = async (id = 151446130) => {
  isLoading.value = true
  const { songs = [] } = await store.dispatch('getInfo', { path: `/album?id=${id}` })
  // console.log(showAlbumList.value[loadIndex.value])
  showAlbumList.value[loadIndex.value]._list = loopFilterAdd({ musicList: songs, transTime: true, timeName: 'dt', artists: 'ar' })
  isLoading.value = false
  loadIndex.value += 1

  // console.log(showAlbumList.value[loadIndex.value]._list)
}

const loadMore = () => {
  if (isLoading.value) return // 请求数据时，不叠加请求
  if (props.hotAlbumList.length === loadIndex.value) {
    isDisabled.value = true
    return
  }
  const { id } = props.hotAlbumList[loadIndex.value]
  showAlbumList.value[loadIndex.value] = _cloneProperty(props.hotAlbumList[loadIndex.value])
  getAlbumList(id)
}
</script>
