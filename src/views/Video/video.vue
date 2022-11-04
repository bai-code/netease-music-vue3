<template>
  <div class="video">
    <el-scrollbar height="395px">
      <NavTitleSelect :titleList="titleList" @changeIndex="changeIndex" :activeIndex="activeIndex" />
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { shallowReactive, ref, watch } from 'vue'
import NavTitleSelect from '@/components/nav-title-select.vue'
import { useRoute, useRouter } from 'vue-router'

const titleList = shallowReactive([
  {
    id: 0,
    text: '视频'
  },
  {
    id: 1,
    text: 'MV'
  }
])

const activeIndex = ref(0)

const route = useRoute()
watch(
  () => route.name,
  (val) => {
    if (val === 'video-content') {
      activeIndex.value = 0
    } else if (val === 'mv-content') {
      activeIndex.value = 1
    }
  },
  { immediate: true }
)

const router = useRouter()
const changeIndex = (index) => {
  activeIndex.value = index
  let name = 'video-content'
  if (index === 0) {
    name = 'video-content'
  } else {
    name = 'mv-content'
  }

  router.push({ name })
}

// watch(
//   activeIndex,
//   (index) => {
//     changeIndex(index)
//   },
//   { immediate: true }
// )

// 一百多条
// const groupTagList = reactive([])
// const getVideoTagList = async () => {
//   const { data } = await store.dispatch('getInfo', { path: '/video/group/list' })
//   groupTagList.push(data)
//   console.log(groupTagList)
// }
</script>

<style lang="less" scoped>
div.video {
  width: 100%;
  height: 100%;
  .el-scrollbar {
    width: 100%;
    padding-right: 20px;
    box-sizing: border-box;
    // overflow-x: hidden;
    .nav-title-select {
      position: sticky;
      top: 0;
    }
  }
}
</style>
