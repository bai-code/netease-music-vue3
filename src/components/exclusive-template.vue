<template>
  <div class="exclusive pointer" @click="playMv">
    <el-skeleton :animated="true" :loading="loading">
      <template #template>
        <el-skeleton-item variant="image" style="width: 100%; height: 100px" />
        <el-skeleton-item variant="text"></el-skeleton-item>
        <el-skeleton-item variant="text"></el-skeleton-item>
      </template>
      <template #default>
        <div class="default-content">
          <div class="image">
            <img v-lazy="videoInfo.sPicUrl" alt="" />
            <span>
              <i class="iconfont icon-hover"></i>
            </span>
          </div>
          <p class="text">{{ videoInfo.name }}</p>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  videoInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const loading = ref(true)

watch(
  () => props.videoInfo.sPicUrl,
  (newVal) => {
    if (newVal) {
      loading.value = false
    }
  },
  { deep: true, immediate: true }
)

const router = useRouter()
const playMv = () => {
  const { id } = props.videoInfo
  if (!id) return
  router.push({ name: 'video-detail', query: { mvid: id } })
}
</script>

<style lang="less" scoped>
div.exclusive {
  div.default-content {
    div.image {
      position: relative;
      width: 350px;
      height: 140px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      span {
        position: absolute;
        border: 1px solid #eee;
        box-sizing: border-box;
        left: 10px;
        top: 10px;
        text-align: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.1);
        i.iconfont {
          color: #eee;
          font-size: 12px;
        }
      }
    }
    p.text {
      .overflowMul(2);
      line-height: 20px;
      margin: 5px 0 20px 0;
    }
  }
}
</style>
