<template>
  <div class="singer-mv">
    <el-row class="singer-mv" type="flex" justify="start" v-infinite-scroll="loadMore" :infinite-scroll-immediate="false" :infinite-scroll-disabled="noHasMore">
      <el-col :span="8" v-for="mv in mvList" :key="mv.id">
        <showMvItem :mvInfo="mv" />
      </el-col>
      <div class="loading" v-loading="isLoading"></div>
      <p class="tip" v-if="noHasMore">----没有更多了---</p>
    </el-row>
  </div>
</template>

<script setup>
import { watch, defineProps, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import showMvItem from '@/components/show-mv-item.vue'
import useComputedCount from '@/hooks/useComputedCount'

const props = defineProps(['singerId'])
const isLoading = ref(false)
const noHasMore = ref(false)
const store = useStore()

const isHasMore = ref(false)
const mvList = reactive([])
const getSingerMv = async (id) => {
  isLoading.value = true
  const offset = mvList.length
  const { mvs = [], hasMore } = await store.dispatch('getInfo', { path: `/artist/mv?id=${id}&offset=${offset}&limit=30` })
  if (hasMore) {
    isHasMore.value = hasMore
  } else {
    noHasMore.value = true
  }
  mvs.forEach((item) => {
    item._playCount = useComputedCount(item.playCount)
  })
  mvList.push(...mvs)
  isLoading.value = false
  // console.log(mvs, hasMore)
}
watch(
  () => props.singerId,
  (id) => {
    if (!id) return
    getSingerMv(id)
  },
  { immediate: true }
)

const loadMore = () => {
  const { singerId } = props
  if (singerId) {
    getSingerMv(singerId)
  }
}
</script>

<style lang="less" scoped>
div.singer-mv {
  width: 100%;
  padding-bottom: 10px;
  .show-mv-item {
    margin-bottom: 20px;
    :deep(div.show-mv-info p.name) {
      .overflow;
      display: block; //原组件有多行省略，用于取消
    }
  }
  div.loading {
    height: 40px;
  }
  p.tip {
    width: 100%;
    text-align: center;
    color: #888;
    letter-spacing: 5px;
  }
}
</style>
