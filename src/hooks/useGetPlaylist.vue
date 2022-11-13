<script setup>
import { useStore } from 'vuex'
const store = useStore()

const getPlaylist = async (id) => {
  return await store.dispatch('getInfo', { path: `/playlist/detail?id=${id}` })
}
return getPlaylist
</script>
