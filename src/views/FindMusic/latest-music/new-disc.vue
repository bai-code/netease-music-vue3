<template>
  <div class="new-disc">
    <NavTitleSlot :titleList="titleList" v-model:activeIndex="activeIndex">
      <template #recommend-all>
        <div class="recommend-all" @click="changeSelect">
          <span :class="[{ select:selectItem },'pointer']">推荐</span>
          <span :class="[{select:!selectItem},'all pointer']">全部</span>
        </div>
      </template>
    </NavTitleSlot>
    新碟上架
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import NavTitleSlot from '@/components/nav-title-slot.vue'
const titleList = reactive([
  {
    id: 0,
    text: '全部',
    type: 0
  },
  {
    id: 1,
    text: '华语',
    type: 7
  },
  {
    id: 2,
    text: '欧美',
    type: 96
  },
  {
    id: 3,
    text: '韩国',
    type: 16
  },
  {
    id: 4,
    text: '日本',
    type: 8
  }
])

const activeIndex = ref(0) // 组件使用
const selectItem = ref(true)

const changeSelect = (e) => {
  const className = e.target.className
  if (className.indexOf('all') >= 0) {
    selectItem.value = false
  } else {
    selectItem.value = true
  }
  // console.log(typeof className)
}
</script>

<style lang="less" scoped>
div.new-disc {
  div.recommend-all {
    span {
      &.all {
        margin-left: 15px;
      }
      &.select {
        color: @bgColor;
      }
    }
  }
}
</style>
