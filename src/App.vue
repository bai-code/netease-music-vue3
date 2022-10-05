<template>
  <div class="home-container">
    <router-view name="nav" ></router-view>
    <router-view name="content" ></router-view>
    <router-view name="footer"  />
  </div>
</template>

<script setup>
</script>

<style lang="less">
div.home-container {
  width: 950px;
  height: 550px;
  .positions(20px,50%);
  font-size: 14px;
  box-shadow: 0 5px 10px @boxShadowColor, 5px 0 10px @boxShadowColor, 0 -5px 10px @boxShadowColor, -5px 0 10px @boxShadowColor;
}
</style>
