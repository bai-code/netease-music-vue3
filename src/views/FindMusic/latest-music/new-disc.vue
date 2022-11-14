<template>
  <div class="new-disc">
    <NavTitleSlot :titleList="titleList" v-model:activeIndex="activeIndex">
      <template #recommend-all>
        <div class="recommend-all" @click="changeSelect">
          <span :class="[{ select: selectItem }, 'pointer']">推荐</span>
          <span :class="[{ select: !selectItem }, 'all pointer']">全部</span>
        </div>
      </template>
    </NavTitleSlot>
    <div v-infinite-scroll="load" class="container">
      <el-row class="music-container" v-for="item in tableDate" :key="item.id">
        <el-row class="content" v-if="item.isShow" type="flex">
          <el-col :span="2" class="sticky">
            <div class="show-sticky">
              <span v-for="(value, key) in item.text" :key="key" :class="[key, { text: value === '本周新碟' }]">{{ value }} </span>
            </div>
          </el-col>
          <el-col :span="22" class="c-right">
            <div class="show-month">
              <template v-for="i in item.data" :key="i.id">
                <ShowMusicInfo :musicInfo="i" :style="{ width: '22%' }" @playMusic="playMusic" showImgName="blurPicUrl" iconPosition="center" :hoverShowText="false" />
              </template>
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
    <!-- <div class="show-loading"  v-if="isLoading">
        <Loading />
    </div> -->
    <div class="timeout" v-if="timeout && error">网络请求有误，请刷新重试！！！！！！</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import NavTitleSlot from '@/components/nav-title-slot.vue'
// import ShowMusicInfoIconCenter from '@/components/show-music-info-icon-center.vue'
import ShowMusicInfo from '@/components/show-music-info.vue'

import { loopFilterAdd } from '@/utils/plugins.js'
const titleList = reactive([
  {
    id: 0,
    text: '全部',
    type: 0
  },
  {
    id: 1,
    text: '华语',
    type: 7
  },
  {
    id: 2,
    text: '欧美',
    type: 96
  },
  {
    id: 3,
    text: '韩国',
    type: 16
  },
  {
    id: 4,
    text: '日本',
    type: 8
  }
])

const activeIndex = ref(0) // 组件使用
const selectItem = ref(true)

const changeSelect = (e) => {
  const className = e.target.className
  if (className.indexOf('all') >= 0) {
    selectItem.value = false
  } else {
    selectItem.value = true
  }
  // console.log(typeof className)
}

const store = useStore()
const isLoading = ref(false) // 是否请求数据中
const date = new Date()
// const isFirstEnter = ref(true)
const timeout = ref(false)
const error = ref(false)
let todayMonth = date.getMonth()
let todayYear = date.getFullYear()
const tableDate = reactive([])
const getDiscList = async (month, year) => {
  const key = `${month + 1}/${year}`
  isLoading.value = true
  if (month || year) {
    const { monthData } = await store.dispatch('getInfo', { path: `/top/album?year=${year}&month=${month}` })
    timeout.value = true
    if (!monthData) {
      isLoading.value = false
      error.value = true
      return
    }
    tableDate.push({ data: loopFilterAdd({ musicList: monthData }), id: [key], text: { month, year }, isShow: true })
  } else {
    const { monthData = [], weekData = [] } = await store.dispatch('getInfo', { path: '/top/album' })
    // console.log(monthData, weekData.length)
    timeout.value = true
    if (weekData.length === 0) {
      isLoading.value = false
      error.value = true
      return
    }
    tableDate.push(
      { data: loopFilterAdd({ musicList: weekData }), id: '本周新碟', text: { month: '本周新碟' }, isShow: true },
      { data: loopFilterAdd({ musicList: monthData }), id: 'currentMonth', text: { month: todayMonth, year: todayYear }, isShow: false }
    )
  }
  timeout.value = true
  isLoading.value = false
  // console.log(tableDate)
}

// const router = useRouter()
const firstShowMonth = ref(true)
const load = () => {
  const name = router.currentRoute.value.name
  if (name !== 'latest-music') return
  if (isLoading.value || !timeout.value) return
  if (firstShowMonth.value) {
    tableDate[1].isShow = true
    firstShowMonth.value = false
    return
  }
  if (todayMonth < 0) {
    todayYear -= 1
    todayMonth = 11
  } else {
    todayMonth -= 1
  }
  getDiscList(todayMonth, todayYear)
}

// let tempLoad = function () {}
// onActivated(() => {
//   tempLoad = load
//   console.log('显示')
// })
// onDeactivated(() => {
//   tempLoad = function () {}
//   console.log('隐藏')
// })

const router = useRouter()
const playMusic = async (params) => {
  const { id } = params
  router.push({ name: 'song-list-package', params: { pId: id } })
}

onMounted(() => {
  getDiscList()
  // console.log('2222');
})
</script>

<style lang="less" scoped>
div.new-disc {
  min-height: 40px;
  position: static;

  .nav-title-slot {
    width: calc(100% - 10px);
  }
  div.recommend-all {
    span {
      &.all {
        margin-left: 15px;
      }
      &.select {
        color: @bgColor;
      }
    }
  }
  div.container {
    min-height: 400px;
    position: static;
  }
  .el-row.music-container {
    position: static;
    .el-row.content {
      position: static;
      width: 100%;
      .el-col.sticky {
        position: static;
        div.show-sticky {
          position: sticky;
          top: 62px;
          height: 100px;
          font-size: 20px;
          text-align: center;
          white-space: wrap;
          width: 50px;
          display: flex;
          flex-direction: column;
          span.month {
            &.text {
              font-size: 20px;
              font-weight: 500;
            }
            font-size: 30px;
          }
          span.year {
            font-size: 12px;
          }
        }
      }
    }
    // min-height: 100px;

    .c-right {
      flex: 0 0 auto;
      width: calc(100% / 24 * 22);
      div.show-month {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .show-music-info {
          margin-right: calc(3%);
        }
      }
    }
  }
  div.show-loading {
    height: 30px;
  }
}
</style>
