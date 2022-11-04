<template>
  <el-row class="container title-category" type="flex" justify="space-between" align="middle">
    <slot name="left">占位</slot>
    <ul class="category">
      <li :class="[{ active: activeIndex === index }, 'c-item', 'pointer']" v-for="(title, index) in categoryList" :key="title.id" @click="changeCategory(index)">
        {{ title.name }}
      </li>
    </ul>
  </el-row>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
  categoryList: {
    type: Array,
    required: true
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['changeCategory'])

const changeCategory = (index) => {
  emits('changeCategory', index)
}
</script>

<style lang="less" scoped>
.el-row.container {
  height: 40px;
  ul.category {
    display: flex;
    font-size: 12px;
    // height: 40px;
    li {
      margin-right: 8px;
      border-radius: 20px;
      padding: 3px 8px;
      box-sizing: border-box;
      &.active {
        color: @bgColor;
        background: #fdebeb;
      }
    }
  }
}
</style>
