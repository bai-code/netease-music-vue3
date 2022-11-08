<template>
  <el-scrollbar height="100%">
    <div class="singer-related">
      <el-row class="info" type="flex">
        <el-col :span="7" class="image">
          <m-image class="el-image" fit="fill" :src="singerInfo.cover" />
        </el-col>
        <el-col :span="17" class="detail">
          <h2 class="name">{{ singerInfo.name }}</h2>
          <div class="alias" v-if="singerInfo.aliasName">
            {{ singerInfo.aliasName }}
          </div>
          <el-tooltip content="建设中..." placement="top">
            <div class="collect pointer">
              <span class="icon">
                <i class="iconfont icon-folder"></i>
              </span>
              <span>收藏</span>
            </div>
          </el-tooltip>
          <div class="show-count">
            <span class="num">单曲数: {{ singerInfo.musicSize }}</span>
            <span class="num">专辑数: {{ singerInfo.albumSize }}</span>
            <span class="num">MV数: {{ singerInfo.mvSize }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row class="container">
        <NavTitleSelect :titleList="titleList" :activeIndex="activeIndex" @changeIndex="changeSelect" />
        <el-col class="list">
          <keep-alive>
            <component :is="tempCmp" :singerId="singerId" :hotAlbumList="hotAlbumList" />
          </keep-alive>
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { reactive, ref, watch, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import NavTitleSelect from '@/components/nav-title-select.vue'

import SingerAlbum from '@/views/FindMusic/singer-list/singer-album.vue'
import SingerDetail from '@/views/FindMusic/singer-list/singer-detail.vue'
import SingerMv from '@/views/FindMusic/singer-list/singer-mv.vue'
import SingerSimi from '@/views/FindMusic/singer-list/singer-simi.vue'

const route = useRoute()
const store = useStore()
const tempCmp = shallowRef(SingerAlbum)
const singerId = ref(0)
// 歌手详情
const singerInfo = ref({})
// const singerInfo = ref({})
const getsingerInfo = async (id) => {
  const { data } = await store.dispatch('getInfo', { path: `/artist/detail?id=${id}` })
  if (data) {
    const { albumSize, musicSize, mvSize, name, cover } = data.artist
    Object.assign(singerInfo.value, { albumSize, musicSize, mvSize, name, cover })
    // console.log(albumSize, musicSize, mvSize, cover)
  }
}

// 歌手专辑
const hotAlbumList = ref()
const getSingerAlbum = async (id) => {
  const {
    artist: { alias },
    hotAlbums
  } = await store.dispatch('getInfo', { path: `/artist/album?id=${id}` })
  let aliasName = ''
  alias.forEach((item, index) => {
    if (index === alias.length - 1) {
      aliasName += item
    } else {
      aliasName += item + '; '
    }
  })
  Object.assign(singerInfo.value, { aliasName })
  hotAlbumList.value = hotAlbums
  console.log(hotAlbums)
}

watch(
  () => route.params.singerId,
  (id) => {
    // const singerId = params
    if (!id) return
    singerId.value = id
    getsingerInfo(id)
    getSingerAlbum(id)
  },
  { immediate: true, deep: true }
)

// 切换tab
const activeIndex = ref(0)
const titleList = reactive([
  {
    id: 0,
    text: '专辑'
  },
  {
    id: 1,
    text: 'MV'
  },
  {
    id: 2,
    text: '歌手详情'
  },
  {
    id: 3,
    text: '相似歌手'
  }
])
const changeSelect = (index) => {
  switch (index) {
    case 0:
      tempCmp.value = SingerAlbum
      break
    case 1:
      tempCmp.value = SingerMv
      break
    case 2:
      tempCmp.value = SingerDetail
      break
    case 3:
      tempCmp.value = SingerSimi
      break
  }
  activeIndex.value = index
}
</script>

<style lang="less" scoped>
.el-scrollbar {
  padding-right: 20px;
}
div.singer-related {
  .el-row.info {
    .el-col.image {
      .el-image {
        height: 185px;
        width: 185px;
        border-radius: 5px;
        background: red;
      }
    }
    .el-col.detail {
      h2.name {
        margin: 0 0 10px 0;
      }
      div.alias {
        // 别名
        margin-bottom: 10px;
      }
      div.collect {
        border: 1px solid @borderColor;
        width: 80px;
        padding: 5px 10px;
        text-align: center;
        border-radius: 20px;
        span.icon {
          margin-right: 5px;
        }
      }
      div.show-count {
        margin-top: 15px;
        font-size: 13px;
        span.num {
          margin-right: 20px;
        }
      }
    }
  }
  .el-row.container {
    margin-top: 20px;
  }
}
</style>
