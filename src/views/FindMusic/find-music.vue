<template>
  <el-scrollbar height="100%" class="scrollbar">
    <div class="nav-title">
      <router-link :to="{ name: 'recommendation' }">个性推荐</router-link>
      <router-link :to="{ name: 'song-list' }">歌单</router-link>
      <router-link :to="{ name: 'ranking-list' }">排行榜</router-link>
      <router-link :to="{ name: 'singer-list' }">歌手</router-link>
      <router-link :to="{ name: 'latest-music' }">最新音乐</router-link>
    </div>

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-scrollbar>
</template>

<style lang="less" scoped>
  
div.nav-title {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 99;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
  width: 100%;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 20px;
    background: #fff;
    top: -20px;
    z-index: 999;
    left: 0;
  }
  & > a {
    margin-right: 15px;
  }
}
.router-link-active {
  font-size: 20px;
  font-weight: bolder;
  border-bottom: 2px solid @bgColor;
  padding-bottom: 5px;
  box-sizing: border-box;
}
</style>
