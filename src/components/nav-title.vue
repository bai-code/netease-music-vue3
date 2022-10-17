<template>
  <div class="nav-title" @click="linkPage">
    <span class="pointer">{{ titleText }}</span>
    <i class="iconfont icon-arrow-right pointer"></i>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
  titleText: {
    type: String,
    require: true
  }
})

const emits = defineEmits(['linkPage'])

const linkPage = () => {
  emits('linkPage')
}
</script>

<style lang="less" scoped>
div.nav-title {
  font-size: 18px;
  font-weight: bolder;
  margin: 10px 0 15px;
}
</style>
