<template>
  <el-container class="home-content">
    <el-aside width="200px">
      <HomeAside />
    </el-aside>
    <el-main id="main-teleport-body">
      <el-scrollbar ref="scrollbarRef">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup>
// @ is an alias to /src
import HomeAside from './home-aside.vue'
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'

const route = useRoute()
const scrollbarRef = ref()
watch(
  () => route.name,
  () => {
    // 切换页面 滚动到顶部
    scrollbarRef.value.scrollTo(0, 0)
  }
)
</script>

<style lang="less" scoped>
.el-container.home-content {
  height: calc(100% - 60px - 70px);
  .el-aside {
    border-right: 1px solid @borderColor;
  }
  .el-main {
    padding: 0;
    box-sizing: border-box;
    .el-scrollbar {
      padding: 20px 20px 0;
      box-sizing: border-box;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
