<template>
  <!-- // 音质选择 -->
  <div class="select-container m-select" ref="domRef">
    <div class="show-title" @click="spreadItem">
      <slot name="show-title">
        <span class="title pointer" :title="list[currentIndex].text">
          <i :class="['iconfont', showText]"></i>
        </span>
      </slot>
    </div>
    <ul :class="['select-content', spreadDirection === 'top' ? 'top' : 'bottom']" v-if="isSpread">
      <slot name="content">
        <li :class="['pointer', {active:currentIndex===index}]" v-for="(item, index) in list" :key="item.id" @click="selectItem($event, item, index)">
          <span class="icon">
            <i :class="['iconfont', item.icon]"></i>
          </span>
          <span>{{ item.text }}</span>
        </li>
      </slot>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, computed, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  showValue: {
    // 展示的值
    type: String,
    default: 'icon'
  },
  // 展开方向
  spreadDirection: {
    type: String,
    default: 'top'
  }
})
const currentIndex = ref(0) // 选中项
const showText = ref('') // 选中文本
const store = useStore()
const loopStatus = computed(() => {
  return store.state.loopStatus
})
watch(
  loopStatus,
  (status) => {
    if (!status) return
    let index = props.list.findIndex((item) => {
      return item.loopStatus === status
    })
    if (index < 0) {
      index = 0
    }
    showText.value = props.list[index].icon
    store.commit('changeLoopStatus', { loopStatus: props.list[index].loopStatus })
    currentIndex.value = index
  },
  { immediate: true }
)

const emit = defineEmits(['selectItem'])
const isSpread = ref(false)
const domRef = ref() // dom元素

// 方便清除
const documentClick = (e) => {
  const flag = domRef.value.contains(e.target)
  if (!flag) {
    isSpread.value = false
    document.removeEventListener('click', documentClick)
  }
}
const spreadItem = () => {
  isSpread.value = !isSpread.value
  if (isSpread.value) {
    document.addEventListener('click', documentClick)
  }
}

const selectItem = (e, item, index) => {
  const flag = domRef.value.contains(e.currentTarget)
  if (flag) {
    emit('selectItem', item)
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
  padding: 5px;
  div.show-title {
    position: relative;
  }
  ul.select-content {
    box-shadow: 0 0 5px #ccc;
    z-index: 999;
    min-width: 100px;
    background: #fff;
    padding: 10px;
    box-sizing: border-box;
    &.top {
      bottom: 40px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    &.top::before,
    &.top::after {
      content: '';
      border: 11px solid;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -22px;
      border-color: #ccc transparent transparent transparent;
    }
    &.top::after {
      border: 10px solid;
      bottom: -20px;
      border-color: #fff transparent transparent transparent;
    }
    &.bottom {
      .positionX(50%,0);
      top: 40px;
    }
    &.bottom::before,
    &.bottom::after {
      content: '';
      border: 11px solid;
      .positionX(50%, 0);
      top: -22px;
      border-color: transparent transparent #ccc transparent;
    }
    &.bottom::after {
      border: 10px solid;
      top: -20px;
      border-color: transparent transparent #fff transparent;
    }
    li {
      padding: 5px 10px;
      white-space: nowrap;
      color: #aaa;
      .flex(flex-start,center);
      &.active{
        color: #666;
      }
      span.icon {
        margin-right: 5px;
      }
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
