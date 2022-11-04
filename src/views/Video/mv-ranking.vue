<template>
  <!-- mv 排行榜 -->
  <div class="mv-ranking">
    <h2>MV排行榜</h2>
    <el-scrollbar>
      <TitleCategroy :categoryList="categoryList" :activeIndex="activeIndex" @changeCategory="changeCategory">
        <template #left>
          <div class="tip default">
            <span>最近更新：{{ showUpdateTime }}</span>
            <span class="icon" title=""><i class="iconfont icon-question-mark"></i></span>
            <div class="hover-text">
              <p>选取云音乐中三个月内发布的热度最高的50支MV，每天更新。</p>
              <p>热度由MV播放、收藏、分享数量综合计算</p>
            </div>
          </div>
        </template>
      </TitleCategroy>

      <div class="loading" v-loading="isLoading" v-if="isLoading"></div>

      <el-row class="show-ranking" type="flex" v-else>
        <el-col :span="12" v-for="(ranking, index) in rankingList" :key="ranking.id">
          <MvRankingItem :rankingInfo="ranking" :index="index" :isLastTwo="rankingList.length - 2 <= index" />
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import MvRankingItem from '@/components/mv-ranking-item.vue'
import TitleCategroy from '@/components/title-category.vue'
import { useStore } from 'vuex'
import { loopFilterAdd } from '@/utils/plugins.js'

const store = useStore()

const isLoading = ref(false)
const showUpdateTime = ref('今天')

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

const rankingList = ref([])
const getMvRankingList = async (area = '内地') => {
  isLoading.value = true
  const { data = [], updateTime } = await store.dispatch('getInfo', { path: `/top/mv?limit=50&area=${area}` })
  // const res = await store.dispatch('getInfo', { path: `/top/mv?limit=50&area=${area}` })

  const newData = loopFilterAdd({ musicList: data, str: 'author' })
  rankingList.value = newData
  isLoading.value = false
  const date = new Date(updateTime).toLocaleDateString()
  const today = new Date().toLocaleDateString()
  if (date === today) {
    showUpdateTime.value = '今天'
  } else {
    showUpdateTime.value = date
  }
  // console.log(res, date, today)
}

const changeCategory = (index) => {
  if (isLoading.value) return
  activeIndex.value = index
  const area = categoryList[index].name
  getMvRankingList(area)
}

onMounted(() => {
  getMvRankingList()
})
</script>

<style lang="less" scoped>
div.mv-ranking {
  height: 100%;
  h2 {
    height: 30px;
    line-height: 30px;
    margin: 0 0 10px 0;
  }
  .el-scrollbar {
    height: calc(100% - 60px);
    padding-right: 20px;
    div.tip {
      color: #aaa;
      font-size: 12px;
      span.icon {
        margin-left: 5px;
        &:hover + div.hover-text {
          visibility: visible;
        }
        i.iconfont {
          font-size: 13px;
        }
      }
      div.hover-text {
        visibility: hidden;
        position: absolute;
        width: 220px;
        line-height: 18px;
        box-shadow: 2px 3px 3px #ccc;
        border-radius: 5px;
        border: 1px solid @borderColor;
        padding: 5px;
        box-sizing: border-box;
        z-index: 999;
        background-color: #fff;
        top: 40px;
        color: #888;
      }
    }

    div.loading {
      height: 50px;
    }
  }
}
</style>
