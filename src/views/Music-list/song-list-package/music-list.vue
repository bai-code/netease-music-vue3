<template>
  <div class="music-list" v-if="showMusicList.length > 0">
    <el-table :data="showMusicList" style="width: 100%" header-row-class-name="headerRowStyle" @row-dblclick="playMusic" :row-class-name="setClassName">
      <el-table-column width="60">
        <template v-slot="scope">
          <span :class="[{ active: activeIndex === scope.$index }, 'index']">{{ fillNum(scope.$index + 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="标题" class-name="column-item title-name default" />
      <el-table-column prop="singer" label="歌手" class-name="column-item singer pointer" width="180" />
      <el-table-column prop="al.name" label="专辑" class-name="column-item album pointer" width="180" />
      <el-table-column prop="durationTime" label="时间" class-name=" column-item durationTime" width="80" />
    </el-table>
  </div>
</template>
<script setup>
import { defineEmits, defineProps, computed } from 'vue'
import { fillNum } from '@/utils/plugins.js'
// import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
const props = defineProps({
  mId: {
    type: [String, Number]
  },
  showMusicList: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emits = defineEmits(['playMusic'])
// const activeIndex = ref(0)

// const showMusicList = ref([])
// const musicList = ref([])
// const store = useStore()
// const getMusicList = async (mId) => {
//   const { songs } = await store.dispatch('getInfo', { path: `/playlist/track/all?id=${mId}` })
//   showMusicList.value = musicList.value = jointSinger({ musicList: songs, artists: 'ar', transTime: true, timeName: 'dt' })
// }

// watch(
//   () => props.mId,
//   (mId) => {
//     if (!mId) return
//     getMusicList(mId)
//   },
//   { immediate: true }
// )

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
  emits('playMusic', row)
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
      background: rgba(0, 0, 0, 0.2) !important;
      .cell {
        color: @bgColor;
      }
    }
    .index {
      color: #ccc;
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
  }
}
</style>
