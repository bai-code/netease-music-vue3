<template>
  <div class="mv-container">
    <TitleCategory :categoryList="categoryList" @changeCategory="changeCategory" :activeIndex="activeIndex">
      <template #left>
        <NavTitle titleText="最新mv" @linkPage="linkPage('最新mv')" />
      </template>
    </TitleCategory>
    <el-row class="show-newest-mv mv-content" :gutter="10" type="flex" justify="space-between">
      <el-col :span="8" v-for="mv in newestMvList" :key="mv.id">
        <ShowMvItem :mvInfo="mv" />
      </el-col>
    </el-row>

    <NavTitle titleText="热播mv" class="title" @linkPage="linkPage('热播mv')" />

    <el-row class="show-hot-mv mv-content" :gutter="10" type="flex" justify="space-between">
      <el-col :span="8" v-for="mv in hotMvList" :key="mv.id">
        <ShowMvItem :mvInfo="mv" />
      </el-col>
    </el-row>

    <NavTitle titleText="网易出品" class="title" @linkPage="linkPage('网易出品')" />

    <el-row class="show-hot-mv mv-content" :gutter="10" type="flex" justify="space-between">
      <el-col :span="8" v-for="mv in neteaseList" :key="mv.id">
        <ShowMvItem :mvInfo="mv" />
      </el-col>
    </el-row>

    <TitleCategory :categoryList="rankingCategoryList" @changeCategory="changeRankingCategory" :activeIndex="rankingActiveIndex">
      <template #left>
        <NavTitle titleText="MV排行榜" @click="$router.push({ name: 'mv-ranking' })" />
      </template>
    </TitleCategory>
    <el-row class="ranking">
      <el-col class="ranking-item" :span="12" v-for="(mv, index) in rankingList" :key="mv.id">
        <MvRankingItem :rankingInfo="mv" :index="index" :isLastTwo="rankingList.length - 2 <= index" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import TitleCategory from '@/components/title-category.vue'
import NavTitle from '@/components/nav-title.vue'
import ShowMvItem from '@/components/show-mv-item.vue'
import { loopFilterAdd } from '@/utils/plugins.js'
import MvRankingItem from '@/components/mv-ranking-item.vue'
import { useRouter } from 'vue-router'

const store = useStore()

const categoryList = reactive([
  {
    id: 0,
    name: '内地'
  },
  {
    id: 1,
    name: '港台'
  },
  {
    id: 2,
    name: '欧美'
  },
  {
    id: 3,
    name: '日本'
  },
  {
    id: 4,
    name: '韩国'
  }
])

const activeIndex = ref(0)
const changeCategory = (index) => {
  activeIndex.value = index
  const area = categoryList[index].name
  getMvList(area)
}

// 最新mv
const newestMvList = ref([])
const getMvList = async (area = '内地') => {
  const { data = [] } = await store.dispatch('getInfo', { path: `/mv/first?limit=6&area=${area}` })
  const newestList = loopFilterAdd({ musicList: data, str: 'author', isTransPlayCount: true })
  newestMvList.value = newestList
  // console.log(data)
}

// 热播mv
const hotMvList = ref([])
const getHotMv = async () => {
  const { data = [] } = await store.dispatch('getInfo', { path: '/top/mv?limit=6' })
  const newestHotList = loopFilterAdd({ musicList: data, str: 'author', isTransPlayCount: true })
  hotMvList.value = newestHotList
  // console.log(data)
}

// 网易出品
const neteaseList = ref([])
const getNeteaseList = async () => {
  const { data = [] } = await store.dispatch('getInfo', { path: '/mv/exclusive/rcmd?limit=6' })
  neteaseList.value = loopFilterAdd({ musicList: data, str: 'author', isTransPlayCount: true })
  // console.log(neteaseList)
}

// mv排行榜数据
const rankingCategoryList = reactive([
  {
    id: 0,
    name: '内地'
  },
  {
    id: 1,
    name: '港台'
  },
  {
    id: 2,
    name: '欧美'
  },
  {
    id: 3,
    name: '日本'
  },
  {
    id: 4,
    name: '韩国'
  }
])
const rankingList = ref([])
const getRankingList = async (area = '内地') => {
  const { data = [] } = await store.dispatch('getInfo', { path: `/top/mv?limit=10&area=${area}` })
  const newData = loopFilterAdd({ musicList: data, str: 'author' })
  rankingList.value = newData
  // console.log(newData)
}

const rankingActiveIndex = ref(0)
const changeRankingCategory = (index) => {
  rankingActiveIndex.value = index
  const area = rankingCategoryList[index].name
  getRankingList(area)
  console.log(area)
}

const router = useRouter()
const linkPage = (query) => {
  const params = {
    area: '全部',
    type: '全部',
    order: '最热'
  }
  switch (query) {
    case '最新mv':
      params.order = '最新'
      break
    case '热播mv':
      params.order = '最热'
      break
    case '网易出品':
      params.type = '网易出品'
      params.order = '最热'
      break
  }
  router.push({ name: 'mv-all', query: { ...params } })
  // console.log(params)
}

onMounted(() => {
  getMvList()
  getHotMv()
  getNeteaseList()
  getRankingList()
})
</script>

<style lang="less" scoped>
div.mv-container {
  overflow: hidden;
  .title-category {
    margin: 10px 0;
  }
  .nav-title {
    &.title {
      margin: 10px 0 20px 0;
    }
    :deep(span) {
      font-size: 18px;
      font-weight: 700;
    }
  }
  .el-row.mv-content{
    min-height: 360px;
  }

  .el-row.ranking {
    .el-col {
      &.border-right {
        border-right: 1px solid #ccc;
      }
    }
  }
}
</style>
