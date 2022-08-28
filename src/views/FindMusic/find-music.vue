<template>
  <NavTitleSelect :titleList="titleList" />
</template>

<script setup>
import { reactive } from 'vue'
import NavTitleSelect from '@/components/nav-title-select.vue'
const titleList = reactive([
  {
    id: 0,
    text: '个性推荐'
  },
  {
    id: 1,
    text: '歌单'
  },
  {
    id: 2,
    text: '排行榜'
  },
  {
    id: 3,
    text: '歌手'
  },
  {
    id: 4,
    text: '最新音乐'
  }
])
</script>
