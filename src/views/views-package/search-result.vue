<template>
  <div class="search-result">
    <h2>搜索 {{ searchText }}</h2>
    <div class="recommend" v-if="artistInfoList.length > 0">
      <h6 class="t">你可能感兴趣</h6>
      <ul class="show-singer">
        <li class="singer-item pointer" v-for="info in artistInfoList" :key="info.id" @click="linkTo(info)">
          <div class="image">
            <img class="m-image" :src="info.img1v1Url || info.picUrl" />
          </div>
          <div class="info">
            <div class="singer">
              <span>{{ info.occupation }}：</span>
              <span>{{ info.name }}</span>
              <span class="en" v-if="info.alias"> ({{ info.alias[0] }})</span>
            </div>
            <div class="other">
              <span class="fans-num">粉丝：{{ computedCount(info.fansSize) }},</span>
              <span clas="music-n"> 歌曲：{{ info.musicSize }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="content">
      <NavTitleSlot :titleList="categoryList" :activeIndex="activeIndex" :borderBottom="true" @update:activeIndex="changeSelect">
        <template #controls
          ><div class="right-txt" v-if="childrenRef && childrenRef.showCount">找到 {{ childrenRef.showCount }}</div></template
        >
      </NavTitleSlot>
      <div class="cmp">
        <component ref="childrenRef" :is="cacheCmp" :searchText="searchText" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computedCount } from '@/utils/plugins.js'
import NavTitleSlot from '@/components/nav-title-slot.vue'
import SingleList from './search-result/single-music'
import Singer from './search-result/singer.vue'
import Album from './search-result/album.vue'
import Video from './search-result/video.vue'
import { ElMessage } from 'element-plus'

const searchText = ref('') // 搜索 text
const route = useRoute()
const store = useStore()
const childrenRef = ref()
const activeIndex = ref(0)
const categoryList = shallowRef([
  {
    id: 0,
    text: '单曲',
    cmp: SingleList
  },
  {
    id: 1,
    text: '歌手',
    cmp: Singer
  },
  {
    id: 2,
    text: '专辑',
    cmp: Album
  },
  {
    id: 3,
    text: '视频',
    cmp: Video
  },
  {
    id: 4,
    text: '歌单'
  },
  {
    id: 5,
    text: '歌词'
  },
  {
    id: 6,
    text: '播客'
  },
  {
    id: 7,
    text: '声音'
  },
  {
    id: 8,
    text: '用户'
  }
])

const cacheCmp = shallowRef('') // 动态组件默认

const router = useRouter()
const changeSelect = (index) => {
  const { cmp } = categoryList.value[index]
  if (cmp) {
    // activeIndex.value = index
    router.push({ name: 'search-result', query: { c: index, s: searchText.value } })
  } else {
    ElMessage({
      type: 'warning',
      message: '建设中'
    })
  }
}

const artistInfoList = ref([])
const getSearchResult = async (val) => {
  const {
    result: { artist = {} }
  } = await store.dispatch('getInfo', { path: `/search/multimatch?keywords=${val}` })
  artistInfoList.value = artist
}

watch(
  () => [route.query.s, route.query.c],
  (val) => {
    searchText.value = val[0]
    getSearchResult(val[0])
    const index = val[1] || 0
    activeIndex.value = -(-index)
    const { cmp } = categoryList.value[index]
    cacheCmp.value = cmp
  },
  { immediate: true }
)

const linkTo = (val) => {
  router.push({ name: 'singer-related', params: { singerId: val.id } })
}
</script>

<style lang="less" scoped>
div.search-result {
  h6.t {
    font-weight: 500;
  }
  ul.show-singer {
    li {
      width: 33%;
      display: flex;
      height: 70px;
      padding: 15px;
      background: #eee;
      border-radius: 5px;
      box-sizing: border-box;
      div.image {
        width: 100%;
        height: 100%;
        margin-right: 10px;
        .m-image {
          width: inherit;
          height: inherit;
          border-radius: 50%;
        }
      }
      div.info {
        flex: 0 0 auto;
        width: calc(100% - 50px);
        font-size: 13px;
        .flex(space-between, flex-start);
        flex-direction: column;
        height: 100%;
        padding: 3px 0;
        box-sizing: border-box;
        div.singer {
          span.en {
            color: #aaa;
          }
        }
        div.other {
          font-size: 12px;
          color: #aaa;
        }
      }
    }
  }

  // 内容区
  div.content {
    .nav-title-slot {
      :deep(li.item) {
        margin-right: 20px;
      }
    }
    div.right-txt {
      color: #aaa;
      padding-top: -5px;
    }
  }
}
</style>
