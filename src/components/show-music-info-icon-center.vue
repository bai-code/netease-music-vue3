<template>
  <div class="show-music-info-icon-center pointer" ref="conRef">
    <div class="image-c" :style="{ width: imgH, height: imgH }" @click="playMusic">
      <!-- <el-image lazy :src="musicInfo.picUrl"></el-image> -->
      <img v-lazy="musicInfo[showImgName] || musicInfo.picUrl || ''" alt="" class="el-image" />
      <span class="show-icon">
        <i class="iconfont icon-hover"></i>
      </span>
    </div>
    <div class="text-content">
      <div class="music-name">{{ musicInfo.name }}</div>
      <div class="singer overflow">{{ musicInfo.singer }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, defineEmits } from 'vue'

const props = defineProps({
  musicInfo: {
    type: Object,
    required: true
  },
  showImgName: {
    type: String,
    default: 'picUrl'
  }
})
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
