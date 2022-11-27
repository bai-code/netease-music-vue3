<template>
  <el-row type="flex" justify="space-between" align="middle" class="home-nav">
    <el-col :span="5">
      <slot name="logo">
        <div class="logo pointer" @click="$router.push({ name: 'home' })"></div>
      </slot>
    </el-col>
    <el-col :span="10">
      <slot name="search">
        <div class="search">
          <div class="move-back">
            <span class="pointer" @click="$router.go(-1)">
              <i class="iconfont icon-arrow-left"></i>
            </span>
            <span class="pointer" @click="$router.go(1)">
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
      </slot>
    </el-col>
    <el-col :span="5" class="avatar">
      <slot name="avatar">
        <div class="avatar-bg">
          <img :src="userInfo.avatarUrl" alt="" />
        </div>
        <div class="userInfo">
          <p class="overflow pointer" @click="spreadControls" v-if="userInfo.token">{{ userInfo.nickname }}</p>
          <p class="overflow pointer" @click="loginIn" v-else>{{ userInfo.nickname }}</p>
          <input type="text" @focus="inputFocus" @blur="inputBlur" ref="inputRef" class="_useIsSpread" />
          <ul class="control" v-if="userInfo.token && isSpread">
            <li class="pointer">用户信息</li>
            <li class="pointer" @click="logout">退出登录</li>
          </ul>
        </div>
      </slot>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const store = useStore()
const isSpread = ref(false) // 是否展开
const inputRef = ref()
const timer = ref()
const inputValue = ref('')

const userInfo = computed(() => {
  return store.state.userinfo.userInfo
})

const inputFocus = () => {
  isSpread.value = true
}
const inputBlur = () => {
  timer.value = setTimeout(() => {
    isSpread.value = false
  }, 150)
}

const router = useRouter()
const loginIn = () => {
  router.push({ name: 'login' })
}
const spreadControls = () => {
  if (isSpread.value) {
    inputBlur()
  } else {
    inputRef.value.focus()
  }
}

onBeforeUnmount(() => {
  clearTimeout(timer.value)
  timer.value = null
})

const logout = async () => {
  const flag = await store.dispatch('userinfo/userLogout')
  ElMessage({
    type: flag ? 'success' : 'error',
    message: flag ? '退出登录成功' : '退出登录失败'
  })
  // console.log(flag)
}

const timeout = ref(null) // 异步定时器
const restaurants = ref([])
const showSearchResult = ref(false) // 输入框是否有值
const oldValue = ref('') // 旧的搜索值
const oldList = ref([]) // 旧的搜索结果
// const result = ref([])
const querySearch = async (queryString, cb) => {
  // const results = [{}]
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
  router.push({ name: 'search-result', query: { s: val } })
}

// 搜索框选中的值（对象）
const handleSelect = (item) => {
  console.log(item)
  const { searchWord } = item
  inputValue.value = searchWord
  changeSearch(searchWord)
}

onMounted(() => {
  getPlaceHolderText()
})
</script>

<style lang="less" scoped>
// 默认添加到body下， 不能在html添加位置添加样式
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
.el-row.home-nav {
  height: 60px;
  padding: 0 20px;
  box-sizing: border-box;
  background: @bgColor;
  .el-col {
    div.logo {
      .bgSrc('~@/static/tabbar.png',0,-15px);
      height: 40px;
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

    &.avatar {
      .flex(flex-start,center);
      div.avatar-bg {
        background: #fff;
        border-radius: 50%;
        height: 37px;
        width: 37px;
        .flex(center,center);
        img {
          height: 35px;
          width: 35px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
      div.userInfo {
        position: relative;
        flex: 0 0 auto;
        width: calc(100% - 40px);
        padding-left: 10px;
        box-sizing: border-box;
        p {
          color: @contrastColor;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
          &:hover {
            text-decoration: underline;
          }
        }
        input._useIsSpread {
          position: absolute;
          height: 0;
          width: 0;
          opacity: 0;
        }
        ul.control {
          position: absolute;
          font-size: 14px;
          padding: 5px 30px 5px 10px;
          box-shadow: 0 0 10px @borderColor;
          border-radius: 3px;
          top: 35px;
          background: @contrastColor;
          z-index: 9999;
          &:before,
          &:after {
            content: '';
            position: absolute;
            border: 10px solid;
            border-color: transparent transparent @borderColor transparent;
            left: 20px;
          }
          &::before {
            top: -21px;
          }
          &::after {
            top: -20px;
            border-color: transparent transparent @contrastColor transparent;
          }
          & > li {
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
  }
}
</style>
