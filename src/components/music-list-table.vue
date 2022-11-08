<template>
  <div class="music-list" v-if="showMusicList.length > 0">
    <el-table :data="showMusicList" style="width: 100%" header-row-class-name="headerRowStyle" @row-dblclick="playMusic" :row-class-name="setClassName" :show-header="isShowHeader" stripe>
      <el-table-column width="50">
        <template v-slot="scope">
          <span class="index" v-if="activeIndex !== scope.$index">{{ fillNum(scope.$index + 1) }}</span>
          <span class="index" v-else>
            <i class="iconfont icon-yangshengqi"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="标题" class-name="column-item title-name default">
        <template v-slot="scope">
          <div class="cell-name">
            <span class="name">{{ scope.row.name }}</span>
            <span class="alia" v-if="scope.row.alia.length > 0">({{ scope.row.alia[0] }})</span>
            <span class="show-sq" v-if="scope.row.sq"> SQ </span>
            <span class="show-mv" v-if="scope.row.mv" @click="playMv(scope.row)"> MV </span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="singer" label="歌手" class-name="column-item singer pointer" width="180" /> -->
      <el-table-column prop="durationTime" label="时间" class-name=" column-item durationTime" width="80" />
    </el-table>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { playAndCommit, findItemIndex, fillNum } from '@/utils/plugins'

const props = defineProps({
  showMusicList: {
    type: Array,
    default: () => {
      return []
    }
  },
  isShowHeader: {
    type: Boolean,
    default: true
  }
})

const store = useStore()
const activeIndex = computed(() => {
  return store.getters.findCurrentPageIndex(props.showMusicList)
})

const setClassName = ({ rowIndex }) => {
  if (activeIndex.value === rowIndex) {
    return 'currentActive'
  }
}

const playMusic = (row) => {
  const { id } = row
  const { showMusicList } = props
  const index = findItemIndex({ musicList: showMusicList, query: 'id', params: id })
  playAndCommit({ store, musicList: showMusicList, index })
}

const router = useRouter()
const playMv = (row) => {
  router.push({ name: 'video-detail', query: { mvid: row.mv } })
}
</script>

<style lang="less" scoped>
div.music-list {
  width: 100%;
  :deep(.el-table) {
    .headerRowStyle {
      .cell {
        color: #333;
      }
    }
    .currentActive {
      .cell {
        color: @bgColor;
        background: rgba(0, 0, 0, 0.2);
      }
    }
    span.index {
      color: #ccc;
      i.iconfont {
        color: @bgColor;
      }
      &.active {
        color: @bgColor;
      }
    }
    .column-item {
      &.title-name {
        color: #333;
      }
      .cell {
        overflow: hidden;
        white-space: nowrap;
      }
      &.album,
      &.singer {
        &:hover {
          color: #666;
        }
      }
      &.album,
      &.singer,
      &.durationTime {
        color: @singerColor;
      }
    }
    .el-table__cell {
      padding: 4px 0;
      border: transparent;
    }
  }

  div.cell-name {
    span.alia {
      color: #999;
      font-size: 13px;
      margin-left: 5px;
    }
    span.show-sq,
    span.show-mv {
      color: #f00;
      border: 1px solid #f00;
      border-radius: 3px;
      padding: 0 2px;
      display: inline-block;
      font-size: 12px;
      height: 14px;
      line-height: 14px;
      letter-spacing: 1px;
      margin-left: 3px;
      position: relative;
      transform: scale(0.9);
      // overflow: hidden;
    }
    span.show-mv {
      padding-right: 8px;
      &::after {
        content: '';
        border-width: 3px 5px;
        border-style: solid;
        border-color: transparent transparent transparent @bgColor;
        position: absolute;
        right: -3px;
        top: 4px;
      }
    }
  }
}
</style>
