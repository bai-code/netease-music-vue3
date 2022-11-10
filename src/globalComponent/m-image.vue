<template>
  <!-- <div class="m-image"> -->
    <el-image class="m-image" fit="fill"  :src="src" :alt="alt" :lazy="lazy">
      <template #placeholder>
        <img class="temp imageFill" src="~@/static/loading.gif" alt="" />
      </template>
      <template #error>
        <img class="temp imageFill" src="~@/static/error.webp" alt="" />
      </template>
    </el-image>
    <!-- <slot></slot> -->
  <!-- </div> -->
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  src: {
    type: String
  },
  lazy: {
    type: Boolean,
    default: true
  },
  alt: {
    type: String
  }
})
</script>

<style lang="less" scoped>
.el-image.m-image {
  // position: relative;
  span.time {
    transform: translate(50%, 50%);
  }
}
</style>
