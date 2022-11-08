<template>
  <!-- 歌手详情页 -->
  <div class="singer-detail">
    <el-row v-for="detail in singerDetail" :key="detail.ti">
      <h3 class="title">{{ detail.ti }}</h3>
      <ul class="txt">
        <li v-for="(t, index) in detail.txt.split('\n')" :key="index">{{ t }}</li>
      </ul>
      <!-- <p class="txt">{{ detail.txt }}</p> -->
    </el-row>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { ref, watch, defineProps } from 'vue'

const props = defineProps({
  singerId: {
    type: [String, Number]
  }
})

const store = useStore()
const singerDetail = ref([])
const getSingerDesc = async (id) => {
  const { introduction = [] } = await store.dispatch('getInfo', { path: `/artist/desc?id=${id}` })
  singerDetail.value = introduction
}

watch(
  () => props.singerId,
  (id) => {
    if (!id) return
    getSingerDesc(id)
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
div.singer-detail {
  h3.title {
    margin: 15px 0;
    width: 100%;
  }
  ul.txt {
    padding-bottom: 20px;
    color: @fontColor;

    li {
      line-height: 24px;
      text-indent: 2em;
      margin-top: 5px;
    }
  }
}
</style>
