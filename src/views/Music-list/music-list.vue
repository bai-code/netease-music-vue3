<template>
  <div v-infinite-scroll="load" class="infinite-list" style="overflow: auto" v-if="musicList.length">
    <el-row v-for="(item, index) in musicList" :key="item.id" class="infinite-list-item" type="flex" align="middle" @dblclick="playMusic(index)" :class="{ active: index === currentIndex }">
      <el-col :span="2" class="index">
        <span v-if="currentIndex === index" class="currentPlay"> <i class="iconfont icon-yangshengqi"></i> </span>
        <span class="index" v-else>{{ fillNum(index + 1) }}</span>
      </el-col>
      <el-col :span="6" class="img">
        <img v-lazy="item.al.picUrl" alt="" />
      </el-col>
      <el-col :span="8" class="music-name">{{ item.name }}</el-col>
      <el-col :span="8" class="singer">{{ item.singer }}</el-col>
    </el-row>
  </div>
  <div class="show-empty" v-else v-loading="isLoading" style="height: 200px"></div>
</template>

<script setup>
import { watchEffect, ref, reactive, computed, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { jointSinger, fillNum, playAndCommit } from '@/utils/plugins.js'

const musicList = reactive([])

const count = ref(0)
const load = () => {
  count.value += 2
}

const isLoading = ref(false)

const route = useRoute()
const store = useStore()
watchEffect(async () => {
  const { id } = route.params
  isLoading.value = true
  const { songs } = await store.dispatch('getInfo', { path: `/album?id=${id}` })
  musicList.push(...jointSinger({ musicList: songs, artists: 'ar' }))
  // musicList.push([{ id: 0, picUrl: '2222', singer: 2, name: 22 }])
  isLoading.value = false
  // console.log(route.params, musicList, id, isLoading.value)
})

const currentIndex = computed(() => {
  return store.getters.findCurrentPageIndex(musicList)
})

const playMusic = (index) => {
  // store.dispatch('getMusicInfo', { musicInfo })
  playAndCommit({ store, musicList, index })
}

onActivated(() => {
  console.log('执行')
})
</script>

<style scoped lang="less">
div.infinite-list {
  .el-row.infinite-list-item {
    height: 60px;
    border-radius: 5px;
    &.active {
      color: @bgColor;
      background: rgba(0, 0, 0, 0.1);
    }
    .el-col {
      &.index {
        color: @singerColor;
        text-align: center;
        span.currentPlay {
          color: @bgColor;
        }
      }
      &.img {
        height: calc(100% - 20px);
        img {
          height: 100%;
          width: 40px;
          border-radius: 5px;
        }
      }
      &.music-name {
      }
      &.singer {
        color: @singerColor;
        font-size: 13px;
      }
    }
  }
}
</style>
