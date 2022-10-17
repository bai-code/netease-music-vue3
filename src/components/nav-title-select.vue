<template>
  <ul class="nav-title-select">
    <li v-for="(title, index) in titleList" :key="title.id" :class="[{ active: activeIndex === index }, 'pointer']" @click="selectItem(index)">{{ title.text }}</li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
  titleList: {
    type: Array,
    require: true
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['changeIndex'])
const selectItem = (index) => {
  emits('changeIndex', index)
}

</script>

<style lang="less" scoped>
ul.nav-title-select {
  .flex(flex-start,center);
  padding: 5px 0 10px;
  background: #fff;
  position: sticky;
  box-sizing: border-box;
  top: 0;
  z-index: 11;
  &::after{
    content: '';
    height: 20px;
    background: inherit;
    top: -20px;
    left: 0;
    width: 100%;
    position: absolute;
  }
  li {
    padding: 5px 10px;
    &.active {
      font-size: 18px;
      font-weight: bolder;
      position: relative;
      &::after{
        content: '';
        position: absolute;
        width: 80%;
        background: @bgColor;
        height: 2px;
        bottom: 0;
        left: 10%;
      }
    }
  }
}
</style>
