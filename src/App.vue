<template>
  <div class="home-container">
    <!-- <el-header class="home-h"> -->
    <router-view name="nav" class="'home-h'"></router-view>
    <!-- </el-header> -->
    <!-- <el-main class="home-m"> -->
    <router-view name="content" class="home-c"></router-view>
    <!-- </el-main> -->
    <!-- <el-footer class="home-f"> -->
    <router-view name="footer" class="'home-f'" />
    <!-- </el-footer> -->
  </div>
</template>

<script setup>
</script>

<style lang="less">
div.home-container {
  width: 950px;
  height: 550px;
  .positions(20px,50%);
  box-shadow: 0 5px 10px @boxShadowColor, 5px 0 10px @boxShadowColor, 0 -5px 10px @boxShadowColor, -5px 0 10px @boxShadowColor;
}
</style>
