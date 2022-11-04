<template>
  <!-- 标题选择  右侧插槽 -->
  <div class="nav-title-slot">
    <ul class="nav-title">
      <li v-for="(title, index) in titleList" :key="title.id" :class="[{ active: index === activeIndex }, 'pointer']" @click="changeIndex(index)">{{ title.text }}</li>
    </ul>
    <slot name="controls"> </slot>
    <slot name="recommend-all"></slot>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
  titleList: {
    type: Array,
    required: true
  },
  activeIndex: {
    type: [Number, String],
    default: 0
  }
})

const emit = defineEmits(['update:activeIndex'])
const changeIndex = (index) => {
  emit('update:activeIndex', index)
}
</script>

<style lang="less" scoped>
div.nav-title-slot {
  .flex(space-between,center);
  margin: 15px 0;
  ul.nav-title {
    .flex(flex-start,center);
    // color: @fontColor;
    & > li {
      margin-right: 10px;
      &.active {
        font-weight: bolder;
      }
    }
  }
}
</style>
