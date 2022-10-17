<template>
  <el-scrollbar>
    <el-row class="link-userInfo" type="flex" v-if="userInfo.profile" :gutter="10">
      <el-col :span="7" class="img">
        <el-image fit="fill" :src="userInfo.profile.avatarUrl" class="avatar"></el-image>
      </el-col>
      <el-col :span="16" class="userInfo">
        <el-row type="flex" justify="space-between">
          <el-col class="info">
            <h2 class="nickname">{{ userInfo.profile.nickname }}</h2>
            <div class="info-controls">
              <div class="u">
                <span class="level">Lv{{ userInfo.level }}</span>
                <span class="icon">
                  <i class="iconfont icon-woman" v-if="userInfo.profile.gender == 2"></i>
                  <i class="iconfont icon-man" v-if="userInfo.profile.gender == 1"></i>
                </span>
                <!-- <el-image :src="userInfo.profile.avatarUrl"></el-image> -->
              </div>
              <div class="c">
                <span class="send-msg pointer">
                  <i class="iconfont icon-email"></i>
                  发私信
                </span>
                <span class="attention pointer">
                  <i class="iconfont icon-add"></i>
                  关注
                </span>
              </div>
            </div>
          </el-col>

          <el-col class="description">
            <div class="signature">
              个人介绍：<span class="signature">{{ userInfo.profile.signature || '暂无介绍' }}</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="content"> 建设中。。。 </el-row>
  </el-scrollbar>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const userInfo = ref({})
const getUserInfo = async (uid) => {
  const info = await store.dispatch('getInfo', {
    path: `/user/detail?uid=${uid}
  `
  })
  userInfo.value = info
  console.log(info)
}

watch(
  () => route.params.userId,
  (newVal) => {
    if (!newVal) return
    // getSubscribers(newVal)
    getUserInfo(newVal)
    console.log(newVal)
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.el-row.link-userInfo {
  width: 100%;
  .el-col.img {
    .el-image.avatar {
      height: 185px;
      width: 185px;
      border-radius: 50%;
    }
  }
  .el-col.userInfo {
    .el-col.info {
      border-bottom: 1px solid #ddd;
      padding-bottom: 15px;
      div.info-controls {
        .flex(space-between,center);
        div.u {
          font-size: 12px;
          span {
            margin-right: 10px;
            &.level {
              padding: 0px 8px;
              background: #eee;
              border-radius: 10px;
            }
            &.icon {
              i.iconfont {
                font-size: 12px;
                padding: 3px;
                border-radius: 50%;
                box-sizing: border-box;
                &.icon-woman {
                  background: #ffcce7;
                  color: #ef77aa;
                }
                &.icon-man {
                  color: #68bde1;
                  background: #bff3ff;
                }
              }
            }
          }
        }
        div.c {
          span {
            border: 1px solid @borderColor;
            padding: 5px 15px;
            border-radius: 20px;
            i.iconfont {
              font-size: 12px;
              &.icon-add {
                color: @bgColor;
              }
            }
          }
        }
      }
    }
    .el-col.description {
      div.signature {
        span.signature {
          color: #888;
        }
      }
    }
  }
}

.el-row.content {
  display: inline-block;
  min-height: 200px;
  text-align: center;
  width: 100%;
  line-height: 200px;
}
</style>
