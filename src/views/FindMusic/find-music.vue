<template>
  <div class="nav-title">
    <NavTitleSelect :titleList="titleList" v-model:activeIndex="activeIndex" @changeIndex="changeIndex" />
  </div>
  <keep-alive>
    <component :is="titleList[activeIndex].cmp"></component>
  </keep-alive>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import NavTitleSelect from '@/components/nav-title-select.vue'
import Recommendation from '@/views/FindMusic/recommendation.vue'
import SongList from '@/views/FindMusic/song-list.vue'

const activeIndex = ref(1)

// 标题区域
const titleList = shallowRef([
  {
    id: 0,
    text: '个性推荐',
    cmp: Recommendation
  },
  {
    id: 1,
    text: '歌单',
    cmp: SongList
  },
  {
    id: 2,
    text: '排行榜',
    cmp: Recommendation
  },
  {
    id: 3,
    text: '歌手',
    cmp: Recommendation
  },
  {
    id: 4,
    text: '最新音乐',
    cmp: Recommendation
  }
])

const changeIndex = (index) => {
  activeIndex.value = index
}
</script>

<style lang="less" scoped>
div.nav-title {
  position: sticky;
  top: 16px;
  background: #fff;
  z-index: 999;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 36px;
    background: #fff;
    top: -36px;
  }
  .nav-title-select{
    position: relative;
    left: -10px;
  }
}
</style>
