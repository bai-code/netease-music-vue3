<template>
  <div class="singer-simi">
    <el-row type="flex" :gutter="20">
      <el-col :span="4.5" v-for="singer in singerSimiList" :key="singer.id">    <ShowSingerInfo :singerInfo="singer" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, watch, defineProps } from 'vue'
import ShowSingerInfo from '@/components/show-singer-info.vue'

const props = defineProps({
  singerId: {
    type: [String, Number]
  }
})

const store = useStore()
const singerSimiList = ref([])
const getSingerDesc = async (id) => {
  const { artists = [] } = await store.dispatch('getInfo', { path: `/simi/artist?id=${id}` })
  singerSimiList.value = artists
  console.log(artists)
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
  div.singer-simi{
    width: 100%;
    overflow-x: hidden;
  }
</style>
