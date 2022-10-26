<template>
  <el-container class="home-content">
    <el-aside width="200px">
      <HomeAside />
    </el-aside>
    <el-main>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup>
// @ is an alias to /src
// import HomeNav from './home-nav.vue'
import HomeAside from './home-aside.vue'
// import HomeFooter from './home-footer.vue'
import { useStore } from 'vuex'
import { onMounted } from 'vue'

const store = useStore()

// 网易播放地址会过期，默认请求一次
onMounted(() => {
  const { musicInfo } = store.state
  store.dispatch('getMusicInfo', { musicInfo, isPlay: false })
})
</script>

<style lang="less" scoped>
.el-container.home-content {
  height: calc(100% - 60px - 70px);
  .el-aside {
    border-right: 1px solid @borderColor;
  }
}
// .el-row.home-content{
//   // height: 100%;
// }

// .el-container.home-container {
//   height: 550px;
//   width: 950px;
//   box-shadow: 0 5px 10px @boxShadowColor, 5px 0 10px @boxShadowColor, 0 -5px 10px @boxShadowColor, -5px 0 10px @boxShadowColor;
//   border-radius: 3px;
//   overflow: hidden;
//   .positions(0px,50%);
//   .el-header.home-h {
//     background-color: @bgColor;
//   }
//   .el-container.home-c {
//     height: calc(100% - 120px);
//     .el-aside {
//       border-right: 1px solid @borderColor;
//     }
//     .el-main.home-m {
//       position: relative;
//       height: 100%;
//       overflow-y: scroll;
//       box-sizing: border-box;
//       padding-top: 20px;
//       background: #fff;
//     }
//   }
//   .el-footer.home-f {
//     border-top: 1px solid @borderColor;
//   }
// }
</style>
