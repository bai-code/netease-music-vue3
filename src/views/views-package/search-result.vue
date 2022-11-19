<template>
  <div class="search-result">
    <h2>搜索 {{ searchText }}</h2>
    <h6>你可能感兴趣</h6>
    <ul class="show-singer">
      <li class="singer-item" v-for="info in artistInfoList" :key="info.id">
        <div class="image">
          <m-image :src="info.img1v1Url || info.picUrl"></m-image>
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
    <div class="content">
      <NavTitleSlot :titleList="categoryList" :activeIndex="activeIndex" :borderBottom="true">
        <template #controls
          ><div class="right-txt" v-if="searchInfo[activeIndex]">找到 {{ searchInfo[activeIndex].text }}</div></template
        >
      </NavTitleSlot>
      <template v-if="searchInfo[activeIndex]">
        <component :is="cacheCmp" :searchText="searchText" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computedCount } from '@/utils/plugins.js'
import NavTitleSlot from '@/components/nav-title-slot.vue'
import SingleList from './search-result/single-music'

const searchText = ref('') // 搜索 text
const route = useRoute()
const store = useStore()
const searchInfo = ref([{}])

const activeIndex = ref(0)
const categoryList = ref([
  {
    id: 0,
    text: '单曲'
  },
  {
    id: 1,
    text: '歌手'
  },
  {
    id: 2,
    text: '专辑'
  },
  {
    id: 3,
    text: '视频'
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

const artistInfoList = ref([])
const getSearchResult = async (val) => {
  const {
    result: { artist = {} }
  } = await store.dispatch('getInfo', { path: `/search/multimatch?keywords=${val}` })
  artistInfoList.value = artist
  // console.log(artistInfoList.value)
}
// const singleList = ref([])
// const showRightText = ref('')
// const pageSize = ref(100) // 歌曲列表分页数
// const musicListAll = ref([]) // 用于缓存所有歌曲列表数据
// const getSearchTypeResult = async () => {
// let txt = ''
// const len = (searchInfo.value[activeIndex.value] && searchInfo.value[activeIndex.value].length) || 0
// const { result: { songs, songCount } = {} } = await store.dispatch('getInfo', { path: `/cloudsearch?keywords=${val}&type=${type}&offset=${len}&limit=5` })
// const newList = loopFilterAdd({ musicList: songs, transTime: true })
// // singleList.value.push(...newList)
// switch (type) {
//   case 1:
//     txt = songCount + '首单曲'
//     break
//   case 100:
//     txt = songCount + '位歌手'
//     break
//   case 10:
//     txt = songCount + '张专辑'
//     break
//   case 1014:
//     txt = songCount + '个视频'
//     break
//   case 1000:
//     txt = songCount + '个歌单'
//     break
//   case 1002:
//     txt = songCount + '个用户'
//     break
//   case 1004:
//     txt = songCount + '个MV'
//     break
//   case 1009:
//     txt = songCount + '个电台'
//     break
//   case 1018:
//     txt = songCount + '个综合'
//     break
//   case 2000:
//     txt = songCount + '个声音'
//     break
// }
// if (type === 1) {
//   // musicListAll.value.splice(len, pageSize, )
// }
// searchInfo.value[activeIndex.value] = { text: txt, total: songCount, list: newList, pageSize }
// showRightText.value = songCount
// console.log(res, val)
// const res = await store.dispatch('getInfo', { path: `/cloudsearch?keywords=${val}&type=100` })
// console.log(res)
// }

watch(
  () => route.query.s,
  (val) => {
    searchText.value = val
    getSearchResult(val)
  },
  { immediate: true }
)

const cacheCmp = shallowRef(SingleList)
</script>

<style lang="less" scoped>
div.search-result {
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
      line-height: 10px;
      padding-top: -5px;
    }
  }
}
</style>
