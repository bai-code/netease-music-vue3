<template>
  <div class="music-detail-content">
    <HomeNav>
      <template v-slot:logo>
        <div class="arrow-down pointer">
          <i class="iconfont icon-arrow-down"></i>
        </div>
      </template>
      <template v-slot:search>
        <div class="isShow" v-if="true">2222</div>
      </template>
      <template v-slot:avatar>
        <span></span>
      </template>
    </HomeNav>
    <div class="content">23456709876</div>
  </div>
</template>
<script setup>
import HomeNav from '@/views/Home/home-nav.vue'

const h = '<h3>哈哈哈哈</h3>'
console.log(h)
</script>

<style lang="less" scope>
div.music-detail-content {
  padding: 10px;
  box-sizing: border-box;
  background: linear-gradient(rgba(0, 0, 222, 0.3) 0, rgba(0, 0, 0, 0) 100%);
  height: calc(100% - 70px);
  .home-nav {
    background: transparent !important;
  }
}
</style>
