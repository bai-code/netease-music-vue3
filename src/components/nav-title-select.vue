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
// const itemIndex = ref(null)
const selectItem = (index) => {
  emits('changeIndex', index)
}
// onMounted(() => {
//   itemIndex.value = props.activeIndex
// })
</script>

<style lang="less" scoped>
ul.nav-title-select {
  .flex(flex-start,center);
  padding: 5px 0 10px;
  li {
    padding: 5px 10px;
    &.active {
      font-size: 18px;
      font-weight: bolder;
      // border-bottom: 2px solid @bgColor;
      // border-bottom-width: 80%;
      position: relative;
      &::after{
        content: '';
        position: absolute;
        width: 70%;
        background: @bgColor;
        height: 2px;
        bottom: 0;
        left: 15%;
      }
    }
  }
}
</style>
