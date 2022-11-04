<template>
  <div class="mv-all">
    <h2 class="title" ref="h2Ref">全部MV</h2>
    <el-scrollbar height="350px" ref="scrollbarRef">
      <el-row class="type-container">
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
      </el-row>
      <el-row class="mv-list">
        <el-col :span="8" v-for="info in showMvList" :key="info.id">
          <ShowMvItem :mvInfo="info" :textOverflow="true" />
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-pagination v-if="showMvList.length > 0" layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage" @current-change="currentChange" />
      </el-row>
      <div class="loading" v-loading="isLoading"></div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { watch, ref } from 'vue'
import TitleCategory from '@/components/title-category.vue'
import { useStore } from 'vuex'
import ShowMvItem from '@/components/show-mv-item.vue'
import { loopFilterAdd, findItemIndex } from '@/utils/plugins.js'

const areaList = [
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
const areaIndex = ref(0)
const typeList = [
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
const typeIndex = ref(0)
const orderList = [
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
const orderIndex = ref(2)

const store = useStore()

const oldObj = ref({
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
  const oldVal = JSON.stringify(oldObj.value)
  const newVal = JSON.stringify({ area, type, order })
  if (oldVal !== newVal) {
    currentPage.value = 1
    mvList.value = []
  }
  const offset = (currentPage.value - 1) * pageSize.value
  const { count, data } = await store.dispatch('getInfo', { path: `/mv/all?area=${area}&type=${type}&order=${order}&offset=${offset}&limit=${pageSize.value}` })
  const newestList = loopFilterAdd({ musicList: data, str: 'author' })
  if (count) {
    total.value = count
  }
  mvList.value.push(...newestList)
  showMvList.value = newestList
  isLoading.value = false
  // console.log(mvList)
}

const routeQuery = ref({})

const setName = (areaIndex, typeIndex, orderIndex) => {
  const area = areaList[areaIndex].name
  const type = typeList[typeIndex].name
  const order = orderList[orderIndex].name
  routeQuery.value = { area, type, order }
  return { area, type, order }
}

const route = useRoute()
const router = useRouter()
// 监听query中数据 请求数据
watch(
  () => route.query,
  (newVal) => {
    if (newVal && newVal.area) {
      const { area, type, order } = newVal
      areaIndex.value = findItemIndex({ musicList: areaList, params: area })
      typeIndex.value = findItemIndex({ musicList: typeList, params: type })
      orderIndex.value = findItemIndex({ musicList: orderList, params: order })
      getMvList(newVal)
      setName(areaIndex.value, typeIndex.value, orderIndex.value)
      oldObj.value = { area, type, order }
    }
  },
  { immediate: true, deep: true }
)

watch([areaIndex, typeIndex, orderIndex], (val) => {
  // const area = areaList[val[0]].name
  // const type = typeList[val[1]].name
  // const order = orderList[val[2]].name
  // routeQuery.value = { area, type, order }
  const query = setName(val[0], val[1], val[2])
  router.replace({ name: 'mv-all', query })
})

const scrollbarRef = ref()
const currentChange = (val) => {
  currentPage.value = val
  const offset = (val - 1) * pageSize.value
  const len = mvList.value.length
  if (len > offset) {
    showMvList.value = mvList.value.slice(offset, offset + pageSize.value)
  } else {
    getMvList(routeQuery.value)
  }
  scrollbarRef.value.setScrollTop(0)
}

// const nextChange = (val) => {
//   console.log(val)
// }
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
    div.loading{
      height: 50px;
    }
  }
}
</style>
