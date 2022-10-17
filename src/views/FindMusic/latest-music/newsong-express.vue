<template>
  <div class="newsong-express">
    <NavTitleSlot :titleList="titleList" v-model:activeIndex="activeIndex">
      <template #controls>
        <div class="controls">
          <div class="play-all pointer" @click="playAllMusic">
            <i class="iconfont icon-play"></i>
            <span class="play-a">播放全部</span>
          </div>
          <div class="collect pointer" title="更新中。。。。。。">
            <i class="iconfont icon-folder"></i>
            <span class="folder">收藏全部</span>
          </div>
        </div>
      </template>
    </NavTitleSlot>
    <!-- 表格 -->
    <el-table :data="tableData[activeIndex]" style="width: 100%" v-loading="isLoading" @row-dblclick="playMusic" :row-class-name="setRow">
      <el-table-column type="#" width="50">
        <template #default="scope">
          <span class="index" v-if="activeClassIndex + 1 != scope.row.index">{{ scope.row.index }}</span>
          <span class="" v-else>
            <i class="iconfont icon-yangshengqi"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="album" width="80">
        <template #default="scope">
          <el-image :src="scope.row.album.blurPicUrl || scope.row.album.picUrl" loading="lazy" class="pointer" >
            <template #error>
              <span class="icon-c">
                <i class="iconfont icon-hover"></i>
              </span>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" class-name="name" width="150" />
      <el-table-column prop="singer" class-name="pointer" width="150" />
      <el-table-column prop="name" width="150" class-name="pointer" />
      <el-table-column prop="durationTime" width="80" class-name="dt" />
    </el-table>
  </div>
</template>

<script setup>
import { shallowReactive, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import NavTitleSlot from '@/components/nav-title-slot.vue'
import { jointSinger, playAndCommit } from '@/utils/plugins.js'

const store = useStore()
const activeIndex = ref(0)
const isLoading = ref(false)
const activeClassIndex = ref(-1)

const titleList = shallowReactive([
  {
    id: 0,
    text: '全部',
    type: 0
  },
  {
    id: 1,
    text: '华语',
    type: 7
  },
  {
    id: 2,
    text: '欧美',
    type: 96
  },
  {
    id: 3,
    text: '韩国',
    type: 16
  },
  {
    id: 4,
    text: '日本',
    type: 8
  },
  {
    id: 5,
    text: '小语种',
    type: null
  }
])

const tableData = ref([])

async function getTableDataList(type) {
  isLoading.value = true
  console.log(isLoading.value)
  const { data = [] } = await store.dispatch('getInfo', { path: `/top/song?type=${type}` })
  // const filterData = jointSinger(data)
  tableData.value[activeIndex.value] = jointSinger({ musicList: data, needIndex: true, transTime: true })
  isLoading.value = false
  console.log(tableData.value, isLoading.value)
}

// 设置活跃项的class类名
const setRow = ({ rowIndex }) => {
  if (rowIndex === activeClassIndex.value) {
    return 'row-active'
  }
}

watchEffect(() => {
  if (typeof tableData.value[activeIndex.value] !== 'object') {
    tableData.value[activeIndex.value] = []
    getTableDataList(titleList[activeIndex.value].type)
  }
  activeClassIndex.value = store.getters.findCurrentPageIndex(tableData.value[activeIndex.value])
})

const playMusic = (row) => {
  playAndCommit({ store, musicList: tableData.value[activeIndex.value], musicInfo: row })
}
// 播放 所有音乐
const playAllMusic = () => {
  const row = tableData.value[activeIndex.value][0]
  playMusic(row)
}
</script>

<style lang="less" scoped>
div.newsong-express {
  .nav-title-slot{
    width: calc(100% - 10px)
  }
  div.controls {
    .flex(space-around,center);
    font-size: 12px;
    div.play-all,
    div.collect {
      border-radius: 25px;
      padding: 5px 15px;
      i.iconfont {
        font-size: 13px;
      }
      span.play-a,
      span.folder {
        margin-left: 5px;
      }
    }
    div.play-all {
      background: @bgColor;
      color: @contrastColor;
      span.play-a {
        margin-left: 3px;
      }
    }
    div.collect {
      margin-left: 20px;
      border: 1px solid @borderColor;
    }
  }

  // 表格
  .el-table {
    /deep/.el-table__body {
      tr {
        height: 80px;
      }
      span.index {
        color: #ccc;
      }
      .el-image {
        border-radius: 5px;
        position: relative;
        span.icon-c {
          display: inline-block;
          height: 30px;
          width: 30px;
          background: #fff;
          .flex(center,center);
          i.iconfont {
            color: @bgColor;
          }
        }
      }
      .row-active {
        background: @hoverColor;
        color: @bgColor;
      }

      .cell {
        white-space: nowrap;
      }
      .pointer .cell {
        cursor: pointer;
      }
      .dt,
      .name .cell {
        color: @singerColor;
        cursor: default;
      }
    }
  }
}
</style>
