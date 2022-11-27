<template>
  <div class="mv-all">
    <h2 class="title" ref="h2Ref">全部MV</h2>
    <!-- <el-row class="type-container">
      <el-col class="area">
        <TitleCategory :categoryList="areaList" :activeIndex="areaIndex" @changeCategory="areaIndex = $event">
          <template #left>
            <span class="area">地区：</span>
          </template>
        </TitleCategory>
      </el-col>
      <el-col class="type">
        <TitleCategory :categoryList="typeList" :activeIndex="typeIndex" @changeCategory="typeIndex = $event">
          <template #left>
            <span class="area">类型：</span>
          </template>
        </TitleCategory>
      </el-col>
      <el-col class="order"
        ><TitleCategory :categoryList="orderList" :activeIndex="orderIndex" @changeCategory="orderIndex = $event">
          <template #left>
            <span class="area">排序：</span>
          </template>
        </TitleCategory></el-col
      >
    </el-row> -->
    <TitleCategoryMore :titleCategory="titleCategory" @changeCategory="changeCategory" />

    <el-row class="mv-list">
      <el-col :span="8" v-for="info in showMvList" :key="info.id">
        <ShowMvItem :mvInfo="info" :textOverflow="true" />
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-pagination v-if="showMvList.length > 0" layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage" @current-change="currentChange" />
    </el-row>
    <div class="loading" v-loading="isLoading"></div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { watch, ref } from 'vue'
import TitleCategoryMore from '@/components/title-category-more.vue'
import { useStore } from 'vuex'
import ShowMvItem from '@/components/show-mv-item.vue'
import { loopFilterAdd, findItemIndex } from '@/utils/plugins.js'

const titleCategory = ref([
  {
    id: 0,
    categoryIndex: 0,
    activeIndex: 0,
    categoryName: '地区',
    children: [
      {
        id: 0,
        name: '全部'
      },
      {
        id: 1,
        name: '内地'
      },
      {
        id: 2,
        name: '港台'
      },
      {
        id: 3,
        name: '欧美'
      },
      {
        id: 4,
        name: '韩国'
      },
      {
        id: 5,
        name: '日本'
      }
    ]
  },
  {
    id: 1,
    categoryIndex: 1,
    activeIndex: 0,
    categoryName: '类型',
    children: [
      {
        id: 0,
        name: '全部'
      },
      {
        id: 1,
        name: '官方版'
      },
      {
        id: 2,
        name: '原声'
      },
      {
        id: 3,
        name: '现场版'
      },
      {
        id: 4,
        name: '网易出品'
      }
    ]
  },
  {
    id: 2,
    categoryIndex: 2,
    activeIndex: 2,
    categoryName: '排序',
    children: [
      {
        id: 0,
        name: '上升最快'
      },
      {
        id: 1,
        name: '最热'
      },
      {
        id: 2,
        name: '最新'
      }
    ]
  }
])

const changeCategory = (val) => {
  const { categoryIndex, activeIndex } = val
  titleCategory.value[categoryIndex].activeIndex = activeIndex
}

const store = useStore()

const routeQuery = ref({
  area: '全部',
  type: '全部',
  order: '最热'
})

const mvList = ref([])
const total = ref(100)
const showMvList = ref([])
const pageSize = ref(90) // 每页条目数
const currentPage = ref(1) // 当前第几页
const isLoading = ref(false)
const getMvList = async ({ area = '全部', type = '全部', order = '最热' }) => {
  isLoading.value = true
  showMvList.value = []
  const oldVal = JSON.stringify(routeQuery.value)
  const newVal = JSON.stringify({ area, type, order })
  if (oldVal !== newVal) {
    currentPage.value = 1
    mvList.value = []
  }
  const offset = (currentPage.value - 1) * pageSize.value
  const { count, data } = await store.dispatch('getInfo', { path: `/mv/all?area=${area}&type=${type}&order=${order}&offset=${offset}&limit=${pageSize.value}` })
  const newestList = loopFilterAdd({ musicList: data, str: 'author', isTransPlayCount: true })
  if (count) {
    total.value = count
  }
  mvList.value.push(...newestList)
  showMvList.value = newestList
  isLoading.value = false
  // console.log(mvList)
}

const route = useRoute()
const router = useRouter()
// 监听query中数据 请求数据
watch(
  () => route.query,
  (newVal) => {
    if (newVal && newVal.area) {
      const { area, type, order } = newVal
      const areaIndex = findItemIndex({ musicList: titleCategory.value[0].children, params: area })
      const typeIndex = findItemIndex({ musicList: titleCategory.value[1].children, params: type })
      const orderIndex = findItemIndex({ musicList: titleCategory.value[2].children, params: order })
      titleCategory.value[0].activeIndex = areaIndex
      titleCategory.value[1].activeIndex = typeIndex
      titleCategory.value[2].activeIndex = orderIndex

      mvList.value = []
      showMvList.value = []
      getMvList(newVal)
      console.log(1)
      routeQuery.value = { area, type, order }
    }
  },
  { immediate: true, deep: true }
)

watch(
  titleCategory,
  (val) => {
    const name1 = val[0].children[val[0].activeIndex].name
    const name2 = val[1].children[val[1].activeIndex].name
    const name3 = val[2].children[val[2].activeIndex].name
    const tempCategory = { area: name1, type: name2, order: name3 }
    let flag = false
    for (const prop in routeQuery) {
      if (routeQuery[prop] !== tempCategory[prop]) {
        flag = true
      }
    }
    console.log(2)
    if (!flag) return
    router.replace({ name: 'mv-all', query: tempCategory })
    // getMvList(tempCategory)
  },
  { immediate: true, deep: true }
)

const currentChange = (val) => {
  currentPage.value = val
  const offset = (val - 1) * pageSize.value
  const len = mvList.value.length
  if (len > offset) {
    showMvList.value = mvList.value.slice(offset, offset + pageSize.value)
  } else {
    getMvList(routeQuery.value)
  }
}
</script>

<style lang="less" scoped>
div.mv-all {
  height: 100%;
  overflow: hidden;
  h2.title {
    margin: 10px 0 15px 0;
  }
  .el-scrollbar {
    padding-right: 15px;
    .el-row.type-container {
      margin-bottom: 15px;
      .el-col {
        font-size: 12px;
        &.area,
        &.type,
        &.order {
          .title-category {
            justify-content: flex-start;
            height: 30px;
          }
        }
      }
    }
    div.loading {
      height: 50px;
    }
  }
}
</style>
