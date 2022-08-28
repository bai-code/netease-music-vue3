<template>
    <el-container class="home-container">
      <el-header class="home-h">
        <HomeNav />
      </el-header>
      <el-container class="home-c">
        <el-aside width="200px" class="home-a">
          <HomeAside />
        </el-aside>
        <el-main class="home-m">
          <router-view />
        </el-main>
      </el-container>
      <el-footer class="home-f">footer</el-footer>
    </el-container>
</template>

<script setup>
// @ is an alias to /src
import HomeNav from './home-nav.vue'
import HomeAside from './home-aside.vue'

</script>

<style lang="less" scoped>
.el-container.home-container{
  height: 500px;
  width: 950px;
  box-shadow: 0 5px 10px @boxShadowColor,
              5px 0 10px @boxShadowColor,
              0 -5px 10px @boxShadowColor,
              -5px 0 10px @boxShadowColor;
  border-radius: 5px;
  .positions(50px);
  .el-header.home-h{
    background-color: @bgColor;
  }
  .el-container.home-c{
    .el-aside{
      border-right: 1px solid @borderColor;
    }
  }
  .el-footer.home-f{
    border-top: 1px solid @borderColor;
  }
}

</style>
