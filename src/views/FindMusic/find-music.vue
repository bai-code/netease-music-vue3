<template>
  <div class="nav-title">
    <router-link :to="{ name: 'recommendation' }">个性推荐</router-link>
    <router-link :to="{ name: 'song-list' }">歌单</router-link>
    <router-link :to="{ name: 'ranking-list' }">排行榜</router-link>
    <router-link :to="{ name: 'singer-list' }">歌手</router-link>
    <router-link :to="{ name: 'latest-music' }">最新音乐</router-link>
  </div>
  
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
// import { ref, shallowRef } from 'vue'
// import NavTitleSelect from '@/components/nav-title-select.vue'
// import Recommendation from '@/views/FindMusic/recommendation.vue'
// import SongList from '@/views/FindMusic/song-list.vue'
// import RankingList from '@/views/FindMusic/ranking-list.vue'
// import LatestMusic from '@/views/FindMusic/latest-music.vue'

// const activeIndex = ref(4)

// 标题区域
// const titleList = shallowRef([
//   {
//     id: 0,
//     text: '个性推荐',
//     cmp: Recommendation
//   },
//   {
//     id: 1,
//     text: '歌单',
//     cmp: SongList
//   },
//   {
//     id: 2,
//     text: '排行榜',
//     cmp: RankingList
//   },
//   {
//     id: 3,
//     text: '歌手',
//     cmp: Recommendation
//   },
//   {
//     id: 4,
//     text: '最新音乐',
//     cmp: LatestMusic
//   }
// ])

// const changeIndex = (index) => {
//   activeIndex.value = index
// }
</script>

<style lang="less" scoped>
div.nav-title {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 999;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 20px;
    background: #fff;
    top: -20px;
    z-index: 999;
    left: 0;
  }
  & > a {
    margin-right: 15px;
  }
}
.router-link-active {
  font-size: 20px;
  font-weight: bolder;
  border-bottom: 2px solid @bgColor;
  padding-bottom: 5px;
  box-sizing: border-box;
}
</style>
