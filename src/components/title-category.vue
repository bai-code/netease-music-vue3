<template>
  <el-row class="container title-category" type="flex" justify="space-between" align="middle">
    <slot name="left">占位</slot>
    <!-- <div class="title-content"> -->
      <ul class="category">
        <li :class="[{ active: activeIndex === index }, 'c-item', 'pointer']" v-for="(title, index) in categoryList" :key="title.id" @click="changeCategory(index)">
          <span>{{ title.name }}</span>
        </li>
      </ul>
    <!-- </div> -->
  </el-row>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  categoryList: {
    type: Array,
    required: true
  },
  activeIndex: {
    type: Number,
    default: 0
  },
  categoryIndex: {
    // 多个分类时，用于查找是哪个分类修改了
    type: Number
  }
})

const emits = defineEmits(['changeCategory'])

const changeCategory = (activeIndex) => {
  const { categoryIndex } = props
  if (categoryIndex === 0 || categoryIndex) {
    emits('changeCategory', { categoryIndex, activeIndex })
  } else {
    emits('changeCategory', activeIndex)
  }
}
</script>

<style lang="less" scoped>
.el-row.container {
  min-height: 40px;
  ul.category {
    display: flex;
    font-size: 12px;
    // height: 40px;
    li.c-item {
      margin-right: 2px;
      span {
        padding: 0px 10px;
        box-sizing: border-box;
        border-radius: 20px;
      }
      &.active span {
        color: @bgColor;
        background: #fdebeb;
      }
    }
  }
}
</style>
