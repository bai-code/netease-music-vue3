<template>
  <ul class="collector" v-if="subscribersList.length > 0" v-infinite-scroll="load">
    <li class="collector-item pointer" v-for="collector in subscribersList" :key="collector.id" @click="linkCollector(collector)">
      <el-image :src="collector.avatarUrl"></el-image>
      <div :class="[collector.signature ? 'between' : 'center', 'content']">
        <div class="userInfo">
          <span>{{ collector.nickname }}</span>
          <span class="sex">
            <i class="iconfont icon-man" v-if="collector.gender === 1"></i>
            <i class="iconfont icon-woman" v-if="collector.gender === 2"></i>
          </span>
        </div>
        <div class="signature overflow" v-if="collector.signature" :title="collector.signature">
          {{ collector.signature }}
        </div>
      </div>
    </li>
    <div v-loading="isLoading" class="show-loading"></div>
    <p v-if="!isMore">------我是有底线的------</p>
  </ul>
  
</template>

<script setup>
import { defineProps, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const isLoading = ref(false)
const store = useStore()

const props = defineProps({
  mId: {
    type: String
  }
})

const subscribersList = ref([])
const isMore = ref(true)
const getSubscribers = async (id, offset = 0, limit = 40) => {
  isLoading.value = true
  const mId = id || props.mId || 0
  const len = offset || subscribersList.value.length || 0
  const { subscribers, more } = await store.dispatch('getInfo', { path: `/playlist/subscribers?id=${mId}&offset=${len}&limit=${limit}` })
  subscribersList.value.push(...subscribers)
  isMore.value = more
  isLoading.value = false
  // console.log(subscribers)
}

watch(
  () => props.mId,
  (mid) => {
    getSubscribers(mid)
  },
  { immediate: true }
)

const router = useRouter()
const route = useRoute()
const linkCollector = async (collector) => {
  const { userId } = collector
  router.push({ name: 'link-userInfo', params: { pId: route.params.pId, userId } })
  // console.log(collector)
}

const load = () => {
  if (isMore.value) {
    getSubscribers()
  }
}
</script>

<style lang="less" scoped>
ul.collector {
  .flex(flex-start,flex-start);
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  li {
    width: 48%;
    margin-bottom: 15px;
    .flex(flex-start,center);
    .el-image {
      flex: 0 0 auto;
      height: 100px;
      width: 100px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 10px;
      border: 1px solid #ccc;
    }
    div.content {
      height: 40px;
      width: calc(100% - 100px - 20px);
      display: flex;
      &.between {
        justify-content: space-between;
      }
      &.center {
        justify-content: center;
      }
      flex-direction: column;
      div.userInfo {
        font-size: 12px;
        span.sex {
          margin-left: 10px;
          i.iconfont {
            font-size: 12px;
            padding: 3px;
            border-radius: 50%;
            box-sizing: border-box;
            &.icon-woman {
              background: #ffcce7;
              color: #ef77aa;
            }
            &.icon-man {
              color: #68bde1;
              background: #bff3ff;
            }
          }
        }
      }
      div.signature {
        flex: 0 0 auto;
        color: @singerColor;
      }
    }
  }
  div.show-loading{
    width: 100%;
    flex: 0 0 auto;
  }
}
</style>
