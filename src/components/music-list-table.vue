<template>
  <div class="music-list" v-if="showMusicList.length > 0">
    <el-table :data="showMusicList" style="width: 100%" header-row-class-name="headerRowStyle" @row-dblclick="playMusic" :row-class-name="setClassName" :show-header="isShowHeader" stripe>
      <el-table-column width="50">
        <template v-slot="scope">
          <div class="index">
            <span v-if="activeIndex !== scope.$index" :class="['index', { mark: isMark && scope.$index < 3 }]">{{ fillIndex ? fillNum(scope.$index + 1) : scope.$index + 1 }}</span>
            <span class="index" v-else>
              <i class="iconfont icon-yangshengqi"></i>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="singer" label="歌手" class-name="column-item singer pointer" width="70" v-if="showImage">
        <template #default="scope">
          <ShowMusicInfoS :musicInfo="scope.row" showImgName="blurPicUrl" :showOther="false" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="标题" class-name="column-item title-name default">
        <template v-slot="scope">
          <div class="cell-name">
            <div
              class="name overflow"
              :title="
                scope.row.alia && scope.row.alia.length > 0 ? scope.row.name + scope.row.alia[0] : scope.row.alias && scope.row.alias.length > 0 ? scope.row.name + scope.row.alias[0] : scope.row.name
              "
            >
              <span class="name overflow">{{ scope.row.name }}</span>
              <span class="alia" v-if="scope.row.alia && scope.row.alia.length > 0">({{ scope.row.alia[0] }})</span>
              <span class="alia" v-else-if="scope.row.alias && scope.row.alias.length > 0">({{ scope.row.alias[0] }})</span>
            </div>
            <span class="show-sq" v-if="showIcon && scope.row.sq"> SQ </span>
            <span class="show-mv" v-if="showIcon && (scope.row.mv || scope.row.mvid)" @click="playMv(scope.row)"> MV </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="singer" label="歌手" class-name="column-item singer pointer" width="160" v-if="showSinger" />
      <el-table-column prop="al.name" label="专辑" class-name="column-item album pointer" width="180" v-if="showAlbum">
        <template v-slot="scope">
          <div class="al overflow" v-if="scope.row.al && scope.row.al.tns" :title="scope.row.al.tns.length > 0 ? scope.row.al.name + scope.row.al.tns[0] : scope.row.al.name">
            <span>{{ scope.row.al.name }}</span>
            <span v-if="scope.row.al.tns.length > 0">( {{ scope.row.al.tns[0] }} )</span>
          </div>
          <div class="al overflow" v-else-if="scope.row.album" :title="scope.row.album.name">
            <span>{{ scope.row.album.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column v-if="showMusicList[0].durationTime" prop="durationTime" label="时间" class-name=" column-item durationTime" width="80" />
    </el-table>
    <slot v-if="showLoading">
      <div class="loading" v-loading="isLoading"></div>
    </slot>
    <slot name="look-more"> </slot>
  </div>
</template>

<script setup>
import { defineProps, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { playAndCommit, findItemIndex, fillNum } from '@/utils/plugins'
import ShowMusicInfoS from '@/components/show-music-info-s'

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
  },
  showIcon: {
    // 是否展示icon图片==》  mv sq vip等
    type: Boolean,
    default: true
  },
  fillIndex: {
    // 索引是否填充成两位数
    type: Boolean,
    default: true
  },
  isMark: {
    // 是否标记列表索引颜色
    type: Boolean,
    default: false
  },
  showSinger: {
    //  是否展示歌手
    type: Boolean,
    default: true
  },
  showAlbum: {
    type: Boolean,
    default: true
  },
  showLoading: {
    // 是否展示loading请求状态
    type: Boolean,
    default: true
  },
  showCurrentStyle: {
    // 是否给当前播放音乐添加样式
    type: Boolean,
    default: true
  },
  showImage: {
    // 是否展示图片
    type: Boolean,
    default: false
  }
  // isLoading: {
  //   // 请求状态
  //   type: Boolean,
  //   default: false
  // }
})

const store = useStore()
const activeIndex = computed(() => {
  if (props.showCurrentStyle) {
    return store.getters.findCurrentPageIndex(props.showMusicList)
  }
  return -1
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
  const { mvid, mv } = row
  router.push({ name: 'video-detail', query: { mvid: mvid || mv } })
}

const isLoading = ref(false)
watch(
  () => props.showMusicList,
  (list) => {
    if (list.length === 0) {
      isLoading.value = true
    } else {
      isLoading.value = false
    }
  }
)
</script>

<style lang="less" scoped>
div.music-list {
  width: 100%;
  // padding: 20px;
  // box-sizing: border-box;
  :deep(.el-table) {
    .headerRowStyle {
      .cell {
        color: #888;
        font-weight: 500;
        font-size: 14px;
      }
    }
    .currentActive {
      .cell {
        color: @bgColor;
        background: rgba(200, 200, 200, 0.3);
      }
    }
    div.index {
      color: #ccc;
      text-align: center;
      &.mark {
        color: @bgColor;
      }
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
      &.durationTime {
        text-align: center;
      }
      .show-music-info-s {
        :deep(.el-image.image) {
          height: 60px;
          width: 60px;
          border-radius: 5px;
        }
      }
    }
    .el-table__cell {
      padding: 0; // 可以控制table列表行高
      border: transparent;
      .cell {
        padding: 7px;
        box-sizing: border-box;
      }
    }
  }

  div.cell-name {
    // display: flex;
    .flex(flex-start, center);
    width: 97%;
    div.name {
      width: 0 1 auto;
      span.alia {
        color: #888;
        margin-left: 5px;
      }
    }
    span.show-sq,
    span.show-mv {
      flex: 0 0 auto;
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
      transform: scale(0.9);
      width: 18px;
    }
    span.show-mv {
      width: 27px;
      letter-spacing: 0px;
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
  div.loading {
    height: 40px;
    width: 100%;
  }
}
</style>
