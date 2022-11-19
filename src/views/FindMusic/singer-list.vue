<template>
  <div class="singer-container" v-if="isMounted">
    <el-row class="singer-category">
      <TitltCategoryMore :titleCategory="titleCategory" @changeCategory="changeCategory" />
    </el-row>
    <el-row class="singer-content" type="flex" justify="space-between" v-infinite-scroll="loadMore" :infinite-scroll-immediate="false">
      <el-col :span="4" v-for="singer in singerList" :key="singer.id">
        <div class="singer-item" @click="linkToSingerRelated(singer)">
          <div class="image pointer">
            <el-image fit="fill" class="imageFill" :src="singer.img1v1Url || singer.picUrl" lazy>
              <template #placeholder>
                <img class="temp imageFill" src="~@/static/loading.gif" alt="" />
              </template>
              <template #error>
                <img class="temp imageFill" src="~@/static/error.webp" alt="" />
              </template>
            </el-image>
          </div>
          <div class="singer">
            <span class="name overflow pointer" :title="singer.name">{{ singer.name }}</span>
            <span class="icon pointer" v-if="singer.accountId">
              <i class="iconfont icon-person"></i>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="loading" v-loading="isLoading"></div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onActivated } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import TitltCategoryMore from '@/components/title-category-more'

// activeIndex 选中项
// categoryIndex 标记分类第几项
const titleCategory = reactive([
  {
    id: 0,
    categoryName: '语种',
    activeIndex: 0,
    categoryIndex: 0,
    children: [
      {
        id: 0,
        name: '全部',
        area: '-1'
      },
      {
        id: 0,
        name: '华语',
        area: '7'
      },
      {
        id: 0,
        name: '欧美',
        area: '96'
      },
      {
        id: 0,
        name: '日本',
        area: '8'
      },
      {
        id: 0,
        name: '韩国',
        area: '16'
      },
      {
        id: 0,
        name: '其他',
        area: '0'
      }
    ]
  },
  {
    id: 1,
    categoryName: '分类',
    activeIndex: 0,
    categoryIndex: 1,
    children: [
      {
        id: 0,
        name: '全部',
        type: -1
      },
      {
        id: 0,
        name: '男歌手',
        type: 1
      },
      {
        id: 0,
        name: '女歌手',
        type: 2
      },
      {
        id: 0,
        name: '乐队组合',
        type: 3
      }
    ]
  },
  {
    id: 2,
    categoryName: '筛选',
    activeIndex: 0,
    categoryIndex: 2,
    children: [
      {
        id: 0,
        name: '热门'
      },
      {
        id: 1,
        name: 'A'
      },
      {
        id: 2,
        name: 'B'
      },
      {
        id: 3,
        name: 'C'
      },
      {
        id: 4,
        name: 'D'
      },
      {
        id: 5,
        name: 'E'
      },
      {
        id: 6,
        name: 'F'
      },
      {
        id: 7,
        name: 'G'
      },
      {
        id: 8,
        name: 'H'
      },
      {
        id: 9,
        name: 'I'
      },
      {
        id: 10,
        name: 'J'
      },
      {
        id: 11,
        name: 'K'
      },
      {
        id: 12,
        name: 'L'
      },
      {
        id: 13,
        name: 'M'
      },
      {
        id: 14,
        name: 'N'
      },
      {
        id: 15,
        name: 'O'
      },
      {
        id: 16,
        name: 'P'
      },
      {
        id: 17,
        name: 'Q'
      },
      {
        id: 18,
        name: 'R'
      },
      {
        id: 19,
        name: 'S'
      },
      {
        id: 20,
        name: 'T'
      },
      {
        id: 21,
        name: 'U'
      },
      {
        id: 22,
        name: 'V'
      },
      {
        id: 23,
        name: 'W'
      },
      {
        id: 24,
        name: 'X'
      },
      {
        id: 25,
        name: 'Y'
      },
      {
        id: 26,
        name: 'Z'
      },
      {
        id: 27,
        name: '#'
      }
    ]
  }
])

const changeCategory = (params) => {
  const { categoryIndex, activeIndex } = params
  titleCategory[categoryIndex].activeIndex = activeIndex
}

const isLoading = ref(false)
const store = useStore()
const singerList = ref([])
const hasMore = ref(true)
const getSingerList = async (area = '-1', type = '-1', initial = '-1') => {
  if (isLoading.value) return
  isLoading.value = true
  if (initial === '热门') {
    initial = -1
  } else if (initial === '#') {
    initial = 0
  }
  const len = singerList.value.length
  const { artists, more } = await store.dispatch('getInfo', { path: `/artist/list?type=${type}&area=${area}&initial=${initial}&offset=${len}` })
  singerList.value.push(...artists)
  hasMore.value = more
  // 如果没有更多，根据取余数填充数组，便于space-between排列
  if (!more) {
    const len = singerList.value.length
    const arr = []
    const count = len % 6
    for (let i = 0; i < count; i++) {
      arr.push({})
    }
    singerList.value.push(...arr)
  }
  isLoading.value = false
}

const tempCategory = ref({})
watch(
  titleCategory,
  (val) => {
    const { area } = val[0].children[val[0].activeIndex]
    const { type } = val[1].children[val[1].activeIndex]
    const { name } = val[2].children[val[2].activeIndex]
    getSingerList(area, type, name)
    singerList.value = []
    tempCategory.value = { area, type, name }
  },
  { immediate: true, deep: true }
)

const loadMore = () => {
  const { area, type, name } = tempCategory
  getSingerList(area, type, name)
  // console.log('更多', tempCategory.value)
}

const router = useRouter()
const linkToSingerRelated = (val) => {
  const { id } = val
  if (!id) return
  router.push({ name: 'singer-related', params: { singerId: id } })
}

const isMounted = ref(false)
onActivated(() => {
  isMounted.value = true
})
</script>

<style lang="less" scoped>
.el-row.singer-category {
  .title-category-more {
    :deep(.title-category) {
      // display: inline-block;
      align-items: flex-start;
      ul.category {
        flex-wrap: wrap;
        width: calc(100% - 40px);
        li.c-item {
          width: 68px;
          text-align: center;
          padding: 0;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.el-row.singer-content {
  .el-col {
    display: flex;
    justify-content: center;
    div.singer-item {
      display: flex;
      flex-direction: column;
      width: 110px;
      div.image {
        height: 110px;
        width: inherit;
        align-self: center;
        .el-image {
          border-radius: 5px;
          border: 1px solid #eee;
        }
      }
      div.singer {
        width: 100%;
        padding: 5px 0 20px 0;
        box-sizing: border-box;
        .flex(space-between,center);
        span.name {
          flex: 0 0 auto;
          width: calc(100% - 20px);
        }
        span.icon {
          background: @bgColor;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          .flex(center,center);
          i.iconfont {
            font-size: 12px;
            color: #fff;
          }
        }
      }
    }
  }
}
div.loading {
  height: 40px;
}
</style>
