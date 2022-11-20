<template>
  <!-- 标题选择  右侧插槽 -->
  <div class="nav-title-slot">
    <ul class="nav-title">
      <li
        v-for="(title, index) in titleList"
        :key="title.id"
        :class="[{ active: index === activeIndex && !borderBottom, borderBottom: index === activeIndex && borderBottom }, 'pointer', 'item']"
        @click="changeIndex(index)"
      >
        {{ title.text }}
      </li>
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
  },
  borderBottom: {
    // 是否添加border-bottom下划线
    type: Boolean,
    default: false
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
      padding-bottom: 5px;
      box-sizing: border-box;
      border-bottom: 3px solid transparent;

      &.active {
        font-weight: bolder;
      }
      &.borderBottom {
        border-bottom-color: @bgColor;
        font-weight: bolder;
      }
    }
  }
}
</style>
