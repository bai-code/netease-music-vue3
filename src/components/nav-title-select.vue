<template>
  <ul class="nav-title">
    <li v-for="(title, index) in titleList" :key="title.id" :class="[{ active: activeIndex === index }, 'pointer']">{{ title.text }}</li>
  </ul>
</template>

<script setup>
import { defineProps, ref } from 'vue'
defineProps({
  titleList: {
    type: Array,
    require: true
  }
})

const activeIndex = ref(0)
</script>

<style lang="less" scoped>
ul.nav-title {
  .flex(flex-start,center);
  li {
    padding: 5px 10px;
  }
}
</style>
