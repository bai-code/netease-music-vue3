<template>
  <div class="search">
    <div class="move-back">
      <span class="pointer" @click="routerGo(-1)">
        <i class="iconfont icon-arrow-left"></i>
      </span>
      <span class="pointer" @click="routerGo(1)">
        <i class="iconfont icon-arrow-right"></i>
      </span>
    </div>
    <el-autocomplete
      v-model="inputValue"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="true"
      clearable
      class="inline-input"
      :placeholder="placeholder"
      @select="handleSelect"
      value-key="searchWord"
      @change="changeSearch"
      ref="autocompleteRef"
    >
      <template #prefix>
        <el-icon class="icon">
          <Search />
        </el-icon>
      </template>
      <template v-slot="scope" v-if="!showSearchResult">
        <li class="s-item" :class="{ hot: scope.item._index <= 3, notContent: !scope.item.content }">
          <span class="h-index"> {{ scope.item._index }}</span>
          <div class="h-content">
            <p>
              <span class="keywords overflow">{{ scope.item.searchWord }}</span>
              <span class="icon" v-if="scope.item.iconType">
                <em>HOT</em>
              </span>
              <span class="s-num">{{ scope.item.score }}</span>
            </p>

            <p class="overflow" v-if="scope.item.content">
              {{ scope.item.content }}
            </p>
          </div>
        </li>
      </template>
      <template #default="scope" v-else>
        <div class="h-content">
          {{ scope.item.keyword }}
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const emits = defineEmits(['handleChange'])

const store = useStore()
const router = useRouter()
const routerGo = (val) => {
  emits('handleChange')
  router.go(val)
}

const inputValue = ref('')

const timeout = ref(null) // 异步定时器
const restaurants = ref([])
const showSearchResult = ref(false) // 输入框是否有值
const oldValue = ref('') // 旧的搜索值
const oldList = ref([]) // 旧的搜索结果

const querySearch = async (queryString, cb) => {
  if (queryString) {
    showSearchResult.value = true
    if (oldValue.value !== queryString) {
      const {
        result: { allMatch = [] }
      } = await store.dispatch('getInfo', { path: `/search/suggest?keywords=${queryString}&type=mobile` })
      allMatch.forEach((item) => {
        item.searchWord = item.keyword
      })
      oldList.value = allMatch
      oldValue.value = queryString
    }
    cb(oldList.value)
  } else {
    showSearchResult.value = false
    if (restaurants.value.length > 0) {
      cb(restaurants.value)
    } else {
      restaurants.value = await getSearchHotDetail()
      clearTimeout(timeout.value)
      timeout.value = setTimeout(() => {
        cb(restaurants.value)
      }, 100)
    }
  }
}

// 获取热搜关键词
const hotSearchList = ref([])
const getSearchHotDetail = async () => {
  const { data = [] } = await store.dispatch('getInfo', { path: '/search/hot/detail' })
  hotSearchList.value = data.forEach((item, index) => {
    item._index = index + 1
  })
  return data
}

// 搜索值 string
const autocompleteRef = ref()
const changeSearch = (val) => {
  autocompleteRef.value.close() // 手动回车不会折叠建议列表
  emits('handleChange')
  router.push({ name: 'search-result', query: { s: val } })
}

// 搜索框选中的值（对象）
const handleSelect = (item) => {
  console.log(item)
  const { searchWord } = item
  inputValue.value = searchWord
  changeSearch(searchWord)
}

// 获取默认搜索词
const placeholder = ref('')
const getPlaceHolderText = async () => {
  const { data, code } = await store.dispatch('getInfo', { path: '/search/default' })
  if (code === 200) {
    placeholder.value = data.realkeyword
  } else {
    placeholder.value = '搜索歌曲/歌手'
  }
}

// 打开歌词页面搜索，home-nav组建中搜索框值无法同步
const route = useRoute()
watch(
  () => route.query.s,
  (val) => {
    if (!val) return
    inputValue.value = val
  },
  { immediate: true }
)

onMounted(() => {
  getPlaceHolderText()
})
</script>

<style lang="less" scoped>
li.s-item {
  height: 55px;
  padding: 8px 0;
  box-sizing: border-box;
  .flex(flex-start, center);
  width: 260px;
  color: #aaa;
  &.notContent div.h-content {
    .flex(center, flex-start);
  }
  &.hot {
    span.h-index {
      color: @bgColor;
    }
    span.keywords {
      font-weight: bolder;
    }
  }
  span.keywords {
    width: calc(100% - 60px);
  }
  span.h-index {
    width: 30px;
    color: #ccc;
  }
  span.icon {
    font-weight: bolder;
    color: @bgColor;
    margin-left: 5px;
    display: inline-block;
    transform: scale(0.8);
    align-self: flex-end;
  }
  span.s-num {
    margin-left: 10px;
    color: #ccc;
    flex: 0 0 auto;
    min-width: 60px;
  }
  div.h-content {
    flex: 0 0 auto;
    width: calc(100% - 50px);
    font-size: 12px;
    height: 100%;
    .flex(space-between,center);
    flex-direction: column;
    p {
      height: 20px;
      line-height: 20px;
      margin: 0;
      flex: 0 1 auto;
      width: 100%;
      span.keywords {
        color: #666;
      }
    }
  }
}

div.search {
  .flex(flex-start, center);
  div.move-back {
    width: 60px;
    margin-right: 30px;
    .flex(space-between,center);
    span {
      .flex(center,center);
      padding: 5px;
      box-sizing: border-box;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      background: rgba(0, 0, 0, 0.1);
      i.iconfont {
        font-size: 12px;
        color: #ccc;
      }
    }
  }
}
:deep(.el-autocomplete.inline-input) {
  @placeholdColor: #fff;
  .el-input__wrapper {
    border-radius: 30px !important;
    background-color: rgba(100, 100, 100, 0.1);
    box-shadow: none;
    input {
      color: @contrastColor;
      font-size: 12px;
      &::placeholder {
        color: @placeholdColor;
      }
    }
    .el-input__suffix {
      color: @contrastColor;
    }
  }
  .el-icon.icon {
    color: @placeholdColor;
  }
}
</style>
