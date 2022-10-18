<template>
  <el-row type="flex" justify="space-between" align="middle" class="home-nav">
    <el-col :span="5">
      <slot name="logo">
        <div class="logo pointer"></div>
      </slot>
    </el-col>
    <el-col :span="10">
      <slot name="search">
        <div class="search">
          <div class="move-back">
            <span class="pointer" @click="routerGo(-1)">
              <i class="iconfont icon-arrow-left"></i>
            </span>
            <span class="pointer" @click="routerGo(1)">
              <i class="iconfont icon-arrow-right"></i>
            </span>
          </div>
          <el-autocomplete v-model="inputValue" :fetch-suggestions="querySearch" :trigger-on-focus="false" clearable class="inline-input" placeholder="请输入歌名/歌手" @select="handleSelect" />
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

const store = useStore()
const isSpread = ref(false) // 是否展开
const inputRef = ref()
const timer = ref()
const inputValue = ref('')

const userInfo = computed(() => {
  return store.state.userinfo.userInfo
})

const handleSelect = (item) => {
  console.log(item)
}

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

const restaurants = ref([])
const querySearch = (queryString, cb) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' }
  ]
}

const routerGo = () => {
  console.log(history)
}

onMounted(() => {
  restaurants.value = loadAll()
})
</script>

<style lang="less" scoped>
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
      .el-input__wrapper {
        border-radius: 30px !important;
        background-color: rgba(100, 100, 100, 0.1);
        box-shadow: none;
        input {
          color: @contrastColor;
          font-size: 12px;
          &::placeholder {
            color: inherit;
          }
        }
        .el-input__suffix {
          color: @contrastColor;
        }
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
