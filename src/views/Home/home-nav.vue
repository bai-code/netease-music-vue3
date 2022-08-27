<template>
  <el-row type="flex" justify="space-between" align="middle">
    <el-col :span="5">
      <div class="logo pointer"></div>
    </el-col>
    <el-col :span="5">
      <el-autocomplete v-model="inputValue" :fetch-suggestions="querySearch" :trigger-on-focus="false" clearable class="inline-input" placeholder="请输入歌名/歌手" @select="handleSelect" />
    </el-col>
    <el-col :span="5" class="avatar">
      <div class="avatar-bg">
        <img :src="userInfo.avatarUrl" alt="" />
      </div>
      <div class="userInfo">
        <p class="overflow pointer" @click="spreadControls">{{ userInfo.nickname }}</p>
        <input type="text" @focus="inputFocus" @blur="inputBlur" ref="inputRef" class="_useIsSpread" />
        <ul class="control" v-if="userInfo.token && isSpread" @click.capture="selectItem">
          <li class="pointer">用户信息</li>
          <li class="pointer">退出登录</li>
        </ul>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

const info = {
  phone: 13735544745,
  password: 'bgf1580087304'
}
const store = useStore()
const isSpread = ref(false) // 是否展开
const inputRef = ref()
const timer = ref()
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

const selectItem = (e) => {
  console.log(e.target)
  inputBlur()
}

store.dispatch('userinfo/userLogin', info)
// console.log(userInfo.value.nickname)

const inputValue = ref('')

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

const handleSelect = (item) => {
  console.log(item)
}

onMounted(() => {
  restaurants.value = loadAll()
})
</script>

<style lang="less" scoped>
.el-row {
  height: 100%;
  .el-col {
    div.logo {
      .bgSrc('~@/static/tabbar.png',0,-15px);
      height: 40px;
    }
    /deep/.el-autocomplete.inline-input {
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
        padding: 2px;
        box-shadow: border-box;
        background: #fff;
        border-radius: 50%;
        img {
          height: 40px;
          width: 40px;
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
