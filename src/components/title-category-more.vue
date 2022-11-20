<template>
  <el-row class="title-category-more">
  <!-- 歌手页面多项选择 -->
    <el-col v-for="title in titleCategory" :key="title.id">
      <TitltCategory :categoryList="title.children" :activeIndex="title.activeIndex" @changeCategory="changeCategory" :categoryIndex="title.categoryIndex">
        <template #left>
          <span class="category-name">{{ title.categoryName }}：</span>
        </template>
      </TitltCategory>
    </el-col>
  </el-row>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import TitltCategory from '@/components/title-category'

defineProps({
  titleCategory: {
    type: Array,
    default: () => {
      return {}
    }
  }
})

const emits = defineEmits(['changeCategory'])

const changeCategory = (params) => {
  emits('changeCategory', params)
}
</script>

<style lang="less" scoped>
.el-row.title-category-more {
  .title-category {
    justify-content: flex-start;
    min-height: 30px;
    span.category-name {
      font-size: 12px;
    }
  }
}
</style>
