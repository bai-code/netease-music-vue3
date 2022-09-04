<template>
  <div class="nav-title pointer">
    <span>{{ titleText }}</span>
    <i class="iconfont icon-arrow-right"></i>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  titleText: {
    type: String,
    require: true
  }
})
</script>

<style lang="less" scoped>
div.nav-title {
  // .flex(flex-start,center);
  font-size: 18px;
  font-weight: bolder;
  margin: 10px 0 15px;
}
</style>
