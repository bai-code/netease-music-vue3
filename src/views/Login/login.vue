<!-- 登录 -->
<template>
  <LoginContent :redirectToPath="redirectToPath" />
</template>

<script>
import LoginContent from './login-content.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  data() {
    return {
      redirectToPath: ''
    }
  },
  components: {
    LoginContent
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.redirectedFrom) {
        const { path } = to.redirectedFrom
        vm.redirectToPath = path
      }
      // console.log(to.redirectedFrom, from)
    })
  }
})
</script>
