<template>
  <!-- // 音质选择 -->
  <div class="select-container m-select" ref="domRef">
    <slot name="placeholder">
      <span class="show-text pointer" @click="spreadItem">{{ levelText }}</span>
    </slot>
    <ul :class="['select-content', spreadDirection === 'top' ? 'top' : 'bottom']" v-if="isSpread && qualityList.length > 0">
      <slot name="content">
        <template v-for="(item, index) in qualityList" :key="item.id">
          <li class="select-item pointer" v-if="item.rate !== 192000" @click="selectItem($event, index)">
            <span class="icon">
              <i v-if="currentIndex === index" class="iconfont icon-duihao"></i>
            </span>
            <div class="vip">
              <span class="vip" v-if="item.chargeType === 1">VIP</span>
            </div>
            <template v-for="(i, j) in qualityListTemp" :key="i.id">
              <span v-if="item.rate === i.rate">{{ qualityListTemp[j].value }}</span>
            </template>
          </li>
        </template>
      </slot>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, shallowRef, computed, watch } from 'vue'
import { useStore } from 'vuex'

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
const currentIndex = ref(0) // 选中项

const qualityListTemp = shallowRef([
  {
    id: 0,
    value: '标准音质',
    text: '标准',
    level: 'standard',
    rate: 128000
  },
  {
    id: 1,
    value: '较高音质',
    text: '较高',
    level: 'higher',
    rate: 192000
  },
  {
    id: 2,
    value: '极高音质',
    text: '极高',
    level: 'exhigh',
    rate: 320000
  },
  {
    id: 3,
    value: '无损音质',
    text: '无损',
    level: 'lossless',
    rate: 999000
  },
  {
    id: 4,
    value: 'Hi-Res',
    text: 'Hi-Res',
    level: 'hires',
    rate: 1999000
  }
])
const levelText = ref('')

const store = useStore()
const _level = computed(() => {
  return store.state._level
})

watch(
  _level,
  (_level) => {
    if (!_level) return
    let index = qualityListTemp.value.findIndex((item) => {
      return item.level === _level
    })
    if (index < 0) {
      index = 0
    }
    const { text, level } = qualityListTemp.value[index]
    currentIndex.value = index
    store.commit('changeQuality', { level })
    levelText.value = text
  },
  { immediate: true }
)

const emit = defineEmits(['changeQuality'])
const isSpread = ref(false)
const domRef = ref() // dom元素

const spreadItem = () => {
  isSpread.value = !isSpread.value
  if (isSpread.value) {
    document.addEventListener('click', (e) => {
      const flag = domRef.value.contains(e.target)
      if (!flag) {
        isSpread.value = false
        document.onclick = null
      }
    })
  }
}

const selectItem = (e, index) => {
  const flag = domRef.value.contains(e.currentTarget)
  if (flag) {
    const { level } = qualityListTemp.value[index]
    emit('changeQuality', level)
    currentIndex.value = index
    store.commit('changeQuality', { level })
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
    border: 1px solid @bgColor;
    padding: 1px 5px;
    color: @bgColor;
  }
  ul.select-content {
    box-shadow: 0 0 5px #ccc;
    position: absolute;
    z-index: 999;
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
      color: #888;
      .flex(flex-start,center);
      &:hover {
        background: #eee;
      }
      span.icon {
        flex: 0 0 auto;
        width: 24px;
        i.iconfont {
          color: @bgColor;
        }
      }
      div.vip {
        width: 40px;
        height: 100%;
        flex: 0 0 auto;
        span.vip {
          display: inline-block;
          height: 12px;
          line-height: 13px;
          padding: -0px 2px;
          color: @bgColor;
          border: 1px solid @bgColor;
        }
      }
    }
  }
}
</style>
