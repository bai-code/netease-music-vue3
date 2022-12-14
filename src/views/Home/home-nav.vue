<template>
  <el-row type="flex" justify="space-between" align="middle" class="home-nav">
    <el-col :span="5">
      <slot name="logo">
        <div class="logo pointer" @click="$router.push({ name: 'home' })"></div>
      </slot>
    </el-col>
    <el-col :span="10">
      <!-- <slot name="search"> -->
      <SearchBox @handleChange="handleChange" />
      <!-- </slot> -->
    </el-col>
    <el-col :span="5" class="avatar">
      <slot name="avatar">
        <div class="avatar-bg">
          <img :src="userInfo.avatarUrl" alt="" />
        </div>
        <div class="userInfo" ref="domRef">
          <p class="overflow pointer" @click="spreadControls" v-if="userInfo.token">{{ userInfo.nickname }}</p>
          <p class="overflow pointer" @click="loginIn" v-else>{{ userInfo.nickname }}</p>
          <!-- <input type="text" @focus="inputFocus" @blur="inputBlur" ref="inputRef" class="_useIsSpread" /> -->
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
import { ref, computed, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SearchBox from './home-nav/search-box.vue'

const emits = defineEmits(['handleChange'])

const store = useStore()
const isSpread = ref(false) // 是否展开

const userInfo = computed(() => {
  return store.state.userinfo.userInfo
})

const router = useRouter()
const loginIn = () => {
  router.push({ name: 'login' })
}

const logout = async () => {
  const flag = await store.dispatch('userinfo/userLogout')
  isSpread.value = false
  ElMessage({
    type: flag ? 'success' : 'error',
    message: flag ? '退出登录成功' : '退出登录失败'
  })
}

const documentClick = (e) => {
  const flag = domRef.value.contains(e.target)
  console.log(flag)
  if (!flag) {
    isSpread.value = false
    document.removeEventListener('click', documentClick)
  }
}

const domRef = ref()
const spreadControls = () => {
  isSpread.value = !isSpread.value
  if (isSpread.value) {
    document.addEventListener('click', documentClick)
  }
}

const handleChange = () => {
  emits('handleChange')
}
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
