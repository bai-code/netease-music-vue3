<template>
  <div class="show-singer-info pointer" @click="linkTo">
    <el-image class="imageFill" :src="singerInfo.picUrl || singerInfo.img1v1Url" alt="" lazy>
      <template #placeholder>
        <img class="temp imageFill" src="~@/static/loading.gif" alt="" />
      </template>
      <template #error>
        <img class="temp imageFill" src="~@/static/error.webp" alt="" />
      </template>
    </el-image>
    <p class="name">{{ singerInfo.name }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  singerInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const router = useRouter()
const linkTo = () => {
  const { id } = props.singerInfo
  if (!id) return
  router.push({ name: 'singer-related', params: { singerId: id } })
}
</script>

<style lang="less" scoped>
div.show-singer-info {
  margin-bottom: 20px;
  .el-image {
    width: 130px;
    height: 130px;
    border-radius: 5px;
    box-shadow: 0 0 3px #ccc;
  }
  p.name {
    padding-top: 5px;
  }
}
</style>
