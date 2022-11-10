<template>
  <div class="show-music-info-icon-center pointer" ref="conRef">
    <el-skeleton style="width: 149px" :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 149px; height: 149px" />
        <div style="padding: 14px 0">
          <el-skeleton-item variant="h4" />
          <div style="display: flex; align-items: center; justify-items: space-between; margin-top: 10px; height: 16px">
            <el-skeleton-item variant="text" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template #default>
        <div class="image-c" :style="{ width: imgH, height: imgH }" @click="playMusic">
          <el-image :src="musicInfo[showImgName] || musicInfo.picUrl || ''" alt="" class="el-image" :lazy="true"></el-image>
          <span class="show-icon">
            <i class="iconfont icon-hover"></i>
          </span>
        </div>
        <div class="text-content">
          <div class="music-name">{{ musicInfo.name }}</div>
          <div class="singer overflow" v-if="musicInfo.singer">{{ musicInfo.singer }}</div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, defineEmits, watch } from 'vue'

const props = defineProps({
  musicInfo: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  },
  showImgName: {
    type: String,
    default: 'picUrl'
  }
})

const loading = ref(true)

watch(
  props.musicInfo,
  (newVal) => {
    if (newVal.name) {
      loading.value = false
    }
  },
  { immediate: true, deep: true }
)

const emits = defineEmits(['playMusic'])

const playMusic = () => {
  emits('playMusic', props.musicInfo)
}

const conRef = ref()
const imgH = ref(0)
onMounted(() => {
  imgH.value = conRef.value.offsetWidth + 'px'
})
</script>

<style lang="less" scoped>
div.show-music-info-icon-center {
  // height: 200px;
  margin-bottom: 15px;
  &:hover span.show-icon {
    opacity: 1;
  }
  div.image-c {
    position: relative;
    .el-image {
      border-radius: 5px;
      height: 100%;
      width: 100%;
    }
    & > span {
      .positions(50%,50%);
      transform: translate(-50%, -50%);
      background: #fff;
      box-sizing: border-box;
      height: 35px;
      width: 35px;
      border-radius: 50%;
      color: @bgColor;
      .flex(center,center);
      opacity: 0;
      transition: opacity 0.5s;
    }
  }
  div.text-content {
    margin-top: 8px;
    line-height: 24px;
    div.music-name {
      color: @fontColor;
      font-size: 14px;
      .overflowMul(2);
      line-height: 20px;
    }
    div.singer {
      color: @singerColor;
      font-size: 12px;
    }
  }
}
</style>
