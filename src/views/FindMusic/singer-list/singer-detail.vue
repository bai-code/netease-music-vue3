<template>
  <!-- 歌手详情页 -->
  <div class="singer-detail" v-if="singerDetail.length > 0">
    <el-row v-for="detail in singerDetail" :key="detail.ti">
      <h3 class="title">{{ detail.ti }}</h3>
      <ul class="txt">
        <li v-for="(t, index) in detail.txt.split('\n')" :key="index">{{ t }}</li>
      </ul>
    </el-row>
  </div>
  <div class="singer-simply-detail" v-else>
    <h3 class="title">歌手简介</h3>
    <p>{{ simplyDetail }}</p>
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
const simplyDetail = ref('')
const getSingerDesc = async (id) => {
  const { introduction = [], briefDesc = '' } = await store.dispatch('getInfo', { path: `/artist/desc?id=${id}` })
  if (introduction.length > 0) {
    singerDetail.value = introduction
  } else {
    simplyDetail.value = briefDesc
  }
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
div.singer-simply-detail {
  text-indent: 2em;
  p {
    padding-left: 24px;
    box-sizing: border-box;
  }
}
</style>
