<template>
  <div class="music-list" v-if="musicList.length > 0">
    <el-table
      :data="musicList"
      style="width: 100%"
      header-row-class-name="headerRowStyle"
      @row-dblclick="playMusic"
      :row-class-name="setClassName"
      :show-header="isShowHeader"
      stripe
      order="sortOrder"
      @row-click="linkToAlbum"
      v-loading="isLoading"
      :style="[drawerMode ? 'font-size:12px' : '']"
    >
      <el-table-column :width="drawerMode ? 40 : 50" prop="index">
        <template v-slot="scope">
          <div class="index">
            <span v-if="activeIndex !== scope.$index && showIndex" :class="['index', { mark: isMark && scope.$index < 3 }]">{{ fillIndex ? fillNum(scope.$index + 1) : scope.$index + 1 }}</span>
            <span class="index" v-if="(activeIndex === scope.$index && showIndex) || (activeIndex === scope.$index && !drawerMode)">
              <i class="iconfont icon-yangshengqi"></i>
            </span>
            <span class="index" v-if="activeIndex === scope.$index && drawerMode && !isPlay">
              <i class="iconfont icon-stop"></i>
            </span>

            <span class="index" v-if="activeIndex === scope.$index && drawerMode && isPlay">
              <i class="iconfont icon-start"></i>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="image" class-name="column-item singer pointer" width="70" v-if="showImage">
        <template #default="scope">
          <div class="image" @click="playMusic(scope.row)">
            <m-image :src="(scope.row.album && scope.row.album.blurPicUrl) || scope.row.blurPicUrl"></m-image>
            <span class="icon" v-if="showImageIcon">
              <i class="iconfont icon-hover"></i>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="标题" class-name="column-item title-name default" :width="drawerMode ? '200' : ''">
        <template v-slot="scope">
          <div class="cell-name">
            <div
              class="name overflow pointer"
              :title="
                scope.row.alia && scope.row.alia.length > 0 ? scope.row.name + scope.row.alia[0] : scope.row.alias && scope.row.alias.length > 0 ? scope.row.name + scope.row.alias[0] : scope.row.name
              "
            >
              <span class="name overflow">{{ scope.row.name }}</span>
              <span class="alia" v-if="scope.row.alia && scope.row.alia.length > 0">({{ scope.row.alia[0] }})</span>
              <span class="alia" v-else-if="scope.row.alias && scope.row.alias.length > 0">({{ scope.row.alias[0] }})</span>
            </div>
            <!-- vip  mv sq 图标 -->
            <span class="show-vip" v-if="showIcon && scope.row.fee === 1"> VIP </span>
            <span class="show-hires" v-if="showIcon && scope.row.privilege && scope.row.privilege.playMaxBrLevel === 'hires'"> Hi-Res </span>
            <span class="show-sq" v-else-if="showIcon && (scope.row.sq || (scope.row.privilege && scope.row.privilege.playMaxBrLevel !== 'hires'))"> SQ </span>

            <span class="show-mv" v-if="showIcon && (scope.row.mv || scope.row.mvid)" @click="playMv(scope.row)"> MV </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="singer" label="歌手" class-name="column-item singer pointer" :width="drawerMode ? 150 / 2 : 150" v-if="showSinger">
        <template #default="scoped" v-if="addSingerAlias">
          <div class="singer pointer" v-if="scoped.row.singer">
            <span class="name">{{ scoped.row.singer[0] }}</span>
            <span class="alias">({{ scoped.row.singer[1] }})</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="al.name" label="专辑" class-name="column-item album pointer" width="150" v-if="showAlbum">
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

      <el-table-column v-if="showMusicList[0].durationTime" prop="durationTime" label="时间" class-name=" column-item durationTime" :width="drawerMode ? 65 : 80" />
    </el-table>
    <slot name="look-more"> </slot>
  </div>
</template>

<script setup>
import { defineProps, computed, watch, ref, defineEmits, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { findItemIndex, fillNum } from '@/utils/plugins'
import { playAndCommit } from '@/utils/playAndCommit'

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
  showIndex: {
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
  },
  showImageIcon: {
    // 是否展示图片中间icon图标
    type: Boolean,
    default: true
  },
  sortOrder: {
    // 排序
    type: String
  },
  addSingerAlias: {
    // 添加歌手别名
    type: Boolean,
    default: false
  },
  drawerMode: {
    // 抽屉模式（缩小版）
    type: Boolean,
    default: false
  }
  // isLoading: {
  //   // loading效果
  //   type: Boolean,
  //   default: false
  // }
})

const emits = defineEmits(['linkToAlbum'])

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

// 默认歌曲 ，双击播放
const playMusic = (row) => {
  const { id } = row
  const { showMusicList } = props
  const index = findItemIndex({ musicList: showMusicList, query: 'id', params: id })
  playAndCommit({ musicList: showMusicList, index })
}

// 点击mv图标
const router = useRouter()
const playMv = (row) => {
  const { mvid, mv } = row
  router.push({ name: 'video-detail', query: { mvid: mvid || mv } })
}

const linkToAlbum = (row) => {
  // console.log(row)
  emits('linkToAlbum', row)
  // router.push({name:'song-list-package', params:{pId:}})
}

const isLoading = ref(false)
const musicList = ref([])
watch(
  () => props.showMusicList,
  (list) => {
    musicList.value = []
    nextTick(() => {
      musicList.value = list
    })
  },
  { immediate: true }
)

const isPlay = computed(() => {
  return store.state.isPlay
})
</script>

<style lang="less" scoped>
div.music-list {
  width: 100%;
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
  div.image {
    height: 60px;
    width: 60px;
    // position: relative;
    .flex(center,center);
    .m-image {
      // position: absolute;
      width: inherit;
      height: inherit;
      border-radius: 5px;
      box-shadow: 0 0 5px #ccc;
    }
    span.icon {
      position: absolute;
      background: #fff;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      .flex(center,center);
      & > i.iconfont {
        color: @bgColor;
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
    span.show-vip,
    span.show-sq,
    span.show-mv,
    span.show-hires {
      flex: 0 0 auto;
      color: #f00;
      border: 1px solid #f00;
      border-radius: 3px;
      padding: 0 1px;
      display: inline-block;
      font-size: 12px;
      height: 14px;
      line-height: 14px;
      letter-spacing: 1px;
      margin-left: 3px;
      transform: scale(0.9);
      width: 18px;
    }
    span.show-vip {
      width: 20px;
      padding: 0 2px;
      letter-spacing: 0;
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
    span.show-hires {
      width: 37px;
      padding: 0;
      letter-spacing: -0.5px;
      font-weight: 500;
    }
  }
  div.loading {
    height: 40px;
    width: 100%;
  }
}
</style>
