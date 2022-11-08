<template>
  <!-- 歌曲专辑列表 -->
  <!-- 左  大图片-->
  <!-- 右  歌曲列表 -->
  <el-row class="album-list" type="flex">
    <el-col :span="6">
      <m-image class="el-image" :src="albumInfo.blurPicUrl"> </m-image>
      <div class="mask-bg"></div>
      <div class="create-time" v-if="albumInfo.publishTime">{{ showCreateTime }}</div>
    </el-col>
    <el-col :span="18">
      <div class="title-c default">
        <h3 class="name">{{ albumInfo.name }}</h3>
        <span class="icon play pointer" @click="playMusic">
          <i class="iconfont icon-play"></i>
        </span>
        <el-tooltip placement="top" content="建设中">
          <span class="icon pointer">
            <i class="iconfont icon-folder"></i>
          </span>
        </el-tooltip>
      </div>
      <MusicListTable :showMusicList="showMusicList" :isShowHeader="isShowHeader" />
      <div class="show-more pointer" v-if="showMore" @click="spreadMore">
        <span>查看全部 {{ showMore }} 首</span>
        <span class="icon">
          <i class="iconfont icon-arrow-right"></i>
        </span>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { defineProps, watch, ref, computed } from 'vue'
import image from '@/static/top50.jpg'
import MusicListTable from '@/components/music-list-table'
import { useStore } from 'vuex'
import { playAndCommit, fillNum } from '@/utils/plugins.js'

const props = defineProps({
  albumList: {
    type: Array,
    default: () => []
  },
  albumInfo: {
    type: Object,
    default: () => {
      return {
        name: '热门50首',
        blurPicUrl: image
      }
    }
  },
  isShowHeader: {
    type: Boolean,
    default: false
  }
})

const showMore = ref(0) // 超出10个多少
const showMusicList = ref([]) // 需要展示的数据

const showCreateTime = computed(() => {
  return new Date(props.albumInfo.publishTime)
    .toLocaleDateString()
    .split('/')
    .map((item) => {
      return fillNum(item)
    })
    .join('-')
})

watch(
  () => props.albumList,
  (list) => {
    const len = list.length
    if (len > 10) {
      showMusicList.value = props.albumList.slice(0, 10)
      showMore.value = len
    } else {
      showMusicList.value = props.albumList
      showMore.value = 0
    }
  },
  { deep: true, immediate: true }
)

const spreadMore = () => {
  showMusicList.value = props.albumList
  showMore.value = 0
}

const store = useStore()
const playMusic = () => {
  const { albumList } = props
  playAndCommit({ store, musicList: albumList, index: 0 })
}
</script>

<style lang="less" scoped>
.el-row.album-list {
  margin-bottom: 30px;
  .el-col {
    .el-image {
      border-radius: 5px;
      height: 150px;
      width: 150px;
      position: relative;
    }
    div.mask-bg {
      background-image: url(~@/static/coverall.png);
      height: 130px;
      width: 165px;
      background-position: 0 -977px;
      position: absolute;
      top: 0;
      // transform: scale(1.1);
      background-size: 265% 1152%;
      background-repeat: no-repeat;
    }

    div.create-time {
      color: #666;
      font-size: 12px;
    }
    div.title-c {
      .flex(flex-start,center);
      h3 {
        margin: 5px;
        height: 20px;
      }
      span.icon {
        color: #666;
        &.play {
          margin: 0 20px;
        }
        i.iconfont {
          color: inherit;
        }
      }
    }
    div.show-more {
      text-align: end;
      font-size: 12px;
      color: #999;
      padding: 10px 20px;
      &:hover {
        color: #777;
      }
      i.iconfont {
        font-size: inherit;
        color: inherit;
      }
    }
  }
}
</style>
