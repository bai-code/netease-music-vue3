<template>
  <ul class="singer">
    <li v-for="item in artistList" :key="item.id" class="pointer" @click="linkTo(item)">
      <div class="info">
        <img class="m-image" :src="item.img1v1Url || item.picUrl" alt="" />
        <p class="name">
          <span class="name">{{ item.name }}</span
          ><span class="alia">({{ (item.alia && item.alia[0]) || (item.alias && item.alias[0]) }})</span>
        </p>
      </div>
      <span class="icon" v-if="item.accountId">
        <i class="iconfont icon-person"></i>
      </span>
    </li>
  </ul>
</template>

<script setup>
import { defineProps, watch, ref, defineExpose } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
  searchText: {
    type: String
  }
})

const store = useStore()
const showCount = ref('') // 需要在父级显示的数据
const artistList = ref([])
const getSingerList = async (val) => {
  const { result: { artistCount, artists = [] } = {} } = await store.dispatch('getInfo', { path: `/cloudsearch?keywords=${val}&type=100` })
  showCount.value = artistCount + '位歌手'
  artistList.value = artists
}

watch(
  () => props.searchText,
  (txt) => {
    if (!txt) return
    getSingerList(txt)
  },
  { immediate: true }
)

const router = useRouter()
const linkTo = (val) => {
  router.push({ name: 'singer-related', params: { singerId: val.id } })
}

defineExpose({
  showCount
})
</script>

<style lang="less" scoped>
ul.singer {
  & > li {
    .flex(space-between,center);
    height: 80px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    &:hover {
      background: rgba(200, 200, 200, 0.3);
    }
    div.info {
      .flex(flex-start,center);
      .m-image {
        height: 60px;
        width: 60px;
        margin-right: 15px;
        border-radius: 5px;
      }
      p.name {
        span.name {
          color: @singerAliasColor;
        }
        span.alia {
          color: @singerColor;
        }
      }
    }
    span.icon {
      background-color: @bgColor;
      .flex(center,center);
      height: 24px;
      width: 24px;
      box-sizing: border-box;
      border-radius: 50%;
      color: #fff;
      i.iconfont {
        font-size: 14px;
      }
    }
  }
}
</style>
