<template>
  <!-- 独家放送 -->
  <div class="exclusive" v-if="isMounted">
    <el-scrollbar height="380px">
      <el-row
        class="container-container"
        type="flex"
        justify="space-between"
        :gutter="20"
        v-infinite-scroll="loadMore"
        infinite-scroll-delay="500"
        infinite-scroll-distance="200"
        :infinite-scroll-immediate="false"
      >
        <el-col :span="12" class="item" v-for="exclusive in exclusiveList" :key="exclusive.id">
          <ExclusiveTemplate :videoInfo="exclusive" />
        </el-col>
      </el-row>
    </el-scrollbar>
    <div class="loading" v-loading="isLoading"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import ExclusiveTemplate from '@/components/exclusive-template.vue'

const store = useStore()
const isLoading = ref(false)

const exclusiveList = reactive([])
const getExclusive = async () => {
  if (isLoading.value) return
  isLoading.value = true
  const len = exclusiveList.length
  const { result = [] } = await store.dispatch('getInfo', { path: `/personalized/privatecontent/list?limit=20&offset=${len}` })
  exclusiveList.push(...result)
  isLoading.value = false
  console.log(result)
}

const loadMore = () => {
  getExclusive()
  console.log('加载更多')
}
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
  getExclusive()
})
</script>

<style lang="less" scoped>
div.exclusive {
  .el-row.exclusive-container {
    min-height: 500px;
    .el-col.item {
      width: 100%;
    }

    div.loading {
      height: 40px;
    }
  }
}
</style>
