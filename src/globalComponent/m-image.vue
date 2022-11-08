<template>
  <div class="m-image">
    <el-image class="imageFill" :src="src" :alt="alt" :lazy="lazy">
      <template #placeholder>
        <img class="temp imageFill" src="~@/static/loading.gif" alt="" />
      </template>
      <template #error>
        <img class="temp imageFill" src="~@/static/error.webp" alt="" />
      </template>
    </el-image>
  </div>
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
