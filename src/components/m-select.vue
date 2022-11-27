<template>
  <div class="select-container m-select" v-if="qualityList" ref="domRef">
    <span class="show-text pointer" @click="spreadItem">{{ qualityList[currentIndex].text }}</span>
    <ul :class="['select-content', spreadDirection === 'top' ? 'top' : 'bottom']" v-if="isSpread">
      <li class="select-item pointer" v-for="(item, index) in qualityList" :key="item.id" @click="selectItem($event, item, index)">
        <slot name="selectItem" :isCurrent="currentIndex === index"></slot>
        <slot name="show-vip"></slot>
        <span>{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'
defineProps({
  qualityList: {
    type: Array,
    default: () => []
  },
  // 展开方向
  spreadDirection: {
    type: String,
    default: 'top'
  }
})
// const qualityList = shallowRef([
//   {
//     id: 0,
//     value: '标准音质',
//     text: '标准',
//     level: 'standard'
//   },
//   {
//     id: 2,
//     value: '极高音质',
//     text: '极高',
//     level: 'exhigh'
//   },
//   {
//     id: 3,
//     value: '无损音质',
//     text: '无损',
//     level: 'lossless'
//   },
//   {
//     id: 4,
//     value: 'Hi-Res',
//     text: 'Hi-Res',
//     level: 'hires'
//   }
// ])

const emit = defineEmits(['selectItem'])
const isSpread = ref(false)
const domRef = ref() // dom元素
const currentIndex = ref(0) // 选中项
// const timer = ref(null)

const spreadItem = () => {
  isSpread.value = !isSpread.value
  if (isSpread.value) {
    document.onclick = (e) => {
      const flag = domRef.value.contains(e.target)
      if (!flag) {
        isSpread.value = false
        document.onclick = null
      }
    }
  }
}

const selectItem = (e, item, index) => {
  const flag = domRef.value.contains(e.currentTarget)
  if (flag) {
    emit('selectItem', item, index)
    currentIndex.value = index
  }
  isSpread.value = false
}
</script>

<style lang="less" scoped>
div.m-select {
  position: relative;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  span.show-text {
    border-radius: 5px;
  }
  ul.select-content {
    box-shadow: 0 0 5px #ccc;
    position: absolute;
    min-width: 100px;
    transform: translateX(-25%);
    background: #fff;
    padding: 10px;
    box-sizing: border-box;
    &.top {
      bottom: 40px;
    }
    &.top::before,
    &.top::after {
      content: '';
      border: 11px solid;
      position: absolute;
      left: 40px;
      bottom: -22px;
      border-color: #ccc transparent transparent transparent;
    }
    &.top::after {
      border: 10px solid;
      left: 41px;
      bottom: -20px;
      border-color: #fff transparent transparent transparent;
    }
    &.bottom {
      top: 40px;
    }
    &.bottom::before,
    &.bottom::after {
      content: '';
      border: 11px solid;
      position: absolute;
      left: 30px;
      top: -22px;
      border-color: transparent transparent #ccc transparent;
    }
    &.bottom::after {
      border: 10px solid;
      left: 31px;
      top: -20px;
      border-color: transparent transparent #fff transparent;
    }
    li {
      padding: 5px 10px;
      white-space: nowrap;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
