<template>
  <div class="latest-music">
    <div class="switch-cmp">
      <div class="cmp pointer" @click="switchCmp">
        <span :class="{ select: cmpIndex === '0' }" data-index="0">新歌速递</span>
        <span :class="{ select: cmpIndex === '1' }" data-index="1">新碟上架</span>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <component :is="activeCmpName" />
    </transition>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import NewSongExpress from '@/views/FindMusic/latest-music/newsong-express.vue'
import NewDisc from '@/views/FindMusic/latest-music/new-disc.vue'

// import { useStore } from 'vuex'
// const store = useStore()

const cmpIndex = ref('0')

const activeCmpName = shallowRef(NewSongExpress) // 活跃的组件

const switchCmp = (e) => {
  const index = e.target.dataset.index
  if (index === '0') {
    activeCmpName.value = NewSongExpress
  } else {
    activeCmpName.value = NewDisc
  }
  cmpIndex.value = index
}
</script>

<style lang="less" scoped>
div.latest-music {
  overflow: hidden;
  div.switch-cmp {
    position: relative;
    height: 30px;
    margin: 10px 0;
    .flex(center,center);
    div.cmp {
      border: 2px solid @borderColor;
      border-radius: 30px;
      span {
        display: inline-block;
        padding: 7px 35px;
        border-radius: 30px;
        &.select {
          background: @bgColor-latest;
          color: @contrastColor;
        }
      }
    }
  }
  .fade-enter-from {
    transform: translateY(600px);
  }
  .fade-leave-to {
    transform: translateX(600px);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s ease-in-out;
  }
}
</style>
