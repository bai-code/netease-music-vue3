<template>
  <div class="router-container">
    <router-link  to="/home/find-music">发现音乐</router-link>
    <router-link to="/home/podcast">播客</router-link>
    <router-link :to="{ name: 'video' }">视频</router-link>
    <router-link :to="{ name:'attention' }">关注</router-link>
    <router-link :to="{ name:'personal-fm' }">私人FM</router-link>
  </div>
</template>

<style lang="less" scoped>
div.router-container {
  display: flex;
  flex-direction: column;
  padding: 10px 0 0 30px;
  box-sizing: border-box;
  & > a {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
		color: @fontColor;
		font-size: 15px;
  }
	.router-link-active{
		color: @activeFontColor;
		background: @asideBgColor;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		font-size: 20px;
		font-weight: bolder;
	}
}

</style>
