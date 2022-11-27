<template>
  <div class="m-message">
    <div class="icon">
      <slot name="icon">
        <span class="icon">
          <i :class="['iconfont', 'icon-' + type]"> </i>
        </span>
      </slot>
    </div>
    <div class="message">
      <slot name="message">
        <span>{{ message }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
const props = defineProps({
  type: {
    type: String,
    default: 'wraning'
  },
  message: {
    type: String
  },
  duration: {
    type: [Number, String],
    default: 3000,
    validator: (val) => {
      return parseInt(val) == -(-val)
    }
  }
})

const timer = ref(null)
const startInterval = () => {
  clearInterval(timer.value)
  timer.value = setInterval(() => {}, props.duration)
}

onMounted(() => {})
</script>
