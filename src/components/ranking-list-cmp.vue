<template>
  <el-row class="ranking-list-cmp">
    <el-col :span="6">
      <div class="image pointer">
        <m-image :src="rankingInfo.coverImgUrl" @click.self="linkTo"> </m-image>
        <div class="time">
          <span v-for="(t, index) in updateTime" :key="index"> {{ t + (index == 0 ? '月' : '日') }}</span>
          <span>更新</span>
        </div>
        <span class="hover-icon" @click="playMusic">
          <i class="iconfont icon-hover"></i>
        </span>
      </div>
    </el-col>
    <el-col :span="18" v-if="rankingInfo.trackList">
      <MusicListTable :showMusicList="rankingInfo.trackList" :isShowHeader="false" :showIcon="showIcon" :fillIndex="fillIndex" :isMark="true" :showSinger="true">
        <template #look-more>
          <div class="look-more" @click="linkTo">
            <span class="fontHover pointer">查看全部</span>
            <i class="iconfont icon-arrow-right"></i>
          </div>
        </template>
      </MusicListTable>
    </el-col>
  </el-row>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { fillNum, playAndCommit } from '@/utils/plugins.js'
import MusicListTable from '@/components/music-list-table'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
  rankingInfo: {
    type: Object,
    default: () => {
      return {
        trackList: []
      }
    }
  },
  showIcon: {
    // 是否展示歌曲icon =》 新歌or排序or上升等
    type: Boolean,
    default: false
  },
  fillIndex: {
    // 是否填充索引
    type: Boolean,
    default: false
  }
})

const updateTime = computed(() => {
  const { updateTime } = props.rankingInfo
  return new Date(updateTime)
    .toLocaleDateString()
    .split('/')
    .splice(1, 2)
    .map((item) => {
      return fillNum(item)
    })
})

const store = useStore()
const playMusic = () => {
  const { trackList } = props.rankingInfo
  playAndCommit({ store, musicList: trackList, index: 0 })
}

const router = useRouter()
const linkTo = () => {
  const { id } = props.rankingInfo
  if (!id) return
  router.push({ name: 'song-list-package', params: { pId: id } })
}
</script>

<style lang="less" scoped>
.el-row.ranking-list-cmp {
  margin-bottom: 30px;
  .el-col {
    div.image {
      height: 170px;
      width: 170px;
      position: relative;
      &:hover span.hover-icon {
        opacity: 1;
      }
      .m-image {
        height: inherit;
        width: inherit;
        border-radius: 5px;
      }
      div.time {
        .posi(50%,70%);
        color: #fff;
        width: 100%;
        text-align: center;
        font-size: 13px;
      }
      span.hover-icon {
        .posi(50%,50%);
        height: 40px;
        width: 40px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        opacity: 0;
        transition: all 0.5s;
        .flex(center,center);
        i.iconfont {
          font-size: 20px;
          color: @bgColor;
        }
      }
    }
    :deep(.el-table) {
      font-size: 12px;
      .singer-name {
        text-align: end;
      }
      .el-table__cell {
        padding: 6px 0;
      }
    }
    div.look-more {
      padding-left: 15px;
      color: #666;
      font-size: 12px;
      margin-top: 5px;
      i.iconfont {
        color: inherit;
        font-size: inherit;
        margin-left: 5px;
      }
    }
  }
}
</style>
