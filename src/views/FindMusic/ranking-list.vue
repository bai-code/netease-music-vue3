<template>
  <div class="ranking-list">
    <div class="official">
      <h3>官方榜</h3>
      <template v-for="item in topListDetail" :key="item.id">
        <RankingListCmp :rankingInfo="item" />
      </template>
    </div>
    <div class="global">
      <h3>全球榜</h3>
      <ul class="g-item">
        <li v-for="item in globalPlaylist" :key="item.id">
          <ShowMusicInfo :musicInfo="item" showImgName="coverImgUrl" iconPosition="center" @playOver="playOver" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { onMounted, ref } from 'vue'
import RankingListCmp from '@/components/ranking-list-cmp'
import { loopFilterAdd, playAndCommit } from '@/utils/plugins.js'
import ShowMusicInfo from '@/components/show-music-info.vue'

const store = useStore()

// const getRankingList1 = async () => {
//   const res = await store.dispatch('getInfo', { path: '/toplist' })
//   console.log(res)
// }

// 获取某个榜单所有歌曲
const getAllRankingList = async (id = 3779629) => {
  const { songs = [] } = await store.dispatch('getInfo', { path: `/playlist/track/all?id=${id}&limit=5` })
  return loopFilterAdd({ musicList: songs, artists: 'ar' })
}

const topListDetail = ref([])
const globalPlaylist = ref([])
const getRankingList = async () => {
  const { list } = await store.dispatch('getInfo', { path: '/toplist/detail' })
  topListDetail.value = list.filter((item) => {
    return item.ToplistType
  })
  topListDetail.value.forEach(async (item) => {
    item.trackList = await getAllRankingList(item.id)
  })

  globalPlaylist.value = list.filter((item) => {
    return !item.ToplistType
  })
  console.log(list, topListDetail)
}

// 直接播放
const playOver = async (val) => {
  const { id } = val
  const musicList = await getAllRankingList(id)
  console.log(id)
  playAndCommit({ store, musicList, index: 0 })
}

onMounted(() => {
  getRankingList()
  // getRankingList1()
  getAllRankingList()
})
</script>

<style lang="less" scoped>
div.ranking-list {
  width: 100%;
  div.global {
    width: 100%;
    ul.g-item {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      & > li {
        flex: 0 0 auto;
        width: 20%;
      }
    }
  }
}
</style>
