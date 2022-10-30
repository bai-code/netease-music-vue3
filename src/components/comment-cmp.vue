<template>
  <div class="comment-cmp" ref="commentRef">
    <el-row class="comment" type="flex" :gutter="10" :class="{ borderTop: isBorderTop }" @contextmenu="contextmenu" v-if="comment.user">
      <el-col :span="2" class="user">
        <div class="image">
          <el-image :src="comment.user.avatarUrl" class="avatar"></el-image>
          <el-image v-if="comment.user.avatarDetail" :src="comment.user.avatarDetail.identityIconUrl" class="small-icon"></el-image>
        </div>
      </el-col>
      <el-col :span="22" class="content">
        <div class="user-text">
          <span class="nickname">{{ comment.user.nickname }}</span>
          <el-image :src="comment.user.vipRights.associator.iconUrl" v-if="comment.user.vipRights && comment.user.vipRights.associator" class="vip" :lazy="true" ></el-image>
          <span class="text">: {{ comment.content }}</span>
        </div>

        <div class="write-back" v-for="beReComment in comment.beReplied" :key="beReComment.id">
          <span class="nickname">@{{ beReComment.user.nickname }}</span>
          <span class="text">: {{ beReComment.content }}</span>
        </div>

        <el-row class="time-other" type="flex" justify="space-between" align="middle">
          <el-col class="time default" :span="6">{{ showTime }}</el-col>
          <el-col class="control" :span="8">
            <el-tooltip content="建设中..." placement="top-end"><span class="tip-off pointer" v-if="!isHidden">举报</span><span class="tip-off" v-else></span></el-tooltip>
            <el-tooltip content="建设中..." placement="top"
              ><span class="pointer overflow"  :title="comment.likedCount">
                <i class="iconfont icon-zan" :class="{ praise: comment.liked }"></i>
                {{ comment.likedCount }}
              </span></el-tooltip
            >
            <el-tooltip content="建设中..." placement="top"
              ><span class="share pointer"> <i class="iconfont icon-share"></i> </span
            ></el-tooltip>
            <el-tooltip content="建设中..." placement="top"
              ><span class="comment pointer"> <i class="iconfont icon-comment"></i> </span
            ></el-tooltip>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, defineEmits } from 'vue'
import { useStore } from 'vuex'
// import { useRoute } from 'vue-router'
// import { ElMessage } from 'element-plus'
const props = defineProps({
  comment: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isBorderTop: {
    type: Boolean,
    default: false
  },
  musicType: {
    // 默认歌曲评论类型   ==》 歌单
    type: [String, Number],
    default: 2
  }
})

const emits = defineEmits(['deleteComment', 'updateInfo'])

const showTime = computed(() => {
  const { time } = props.comment
  const date = new Date(time).toLocaleString().split(' ')
  const d = date[0].replace(/(\d{4})\/(\d{1,2})\/(\d{1,2})/g, '$1年$2月$3日')
  const t = date[1].substring(0, 5)
  return `${d}  ${t}`
})

const store = useStore()
const userId = computed(() => {
  return store.state.userinfo.userInfo.userId
})
const isHidden = computed(() => {
  return props.comment.user.userId === userId.value
})

const commentRef = ref()
const contextmenu = (e) => {
  e.preventDefault()
  if (isHidden.value) {
    const dom = document.createElement('div')
    const temp = `
      <i class='iconfont icon-delete'></i>
      删除（Delete）
    `
    const domClass = {
      position: 'absolute',
      height: '30px',
      width: '140px',
      boxShadow: '0 0 10px #aaa',
      backgroundColor: '#fff',
      lineHeight: '30px',
      textAlign: 'center',
      borderRadius: '5px',
      cursor: 'pointer'
    }
    for (const prop in domClass) {
      dom.style[prop] = domClass[prop]
    }
    dom.innerHTML = temp
    const { offsetX, offsetY } = e
    dom.style.left = offsetX + 50 + 'px'
    dom.style.top = offsetY + 15 + 'px'
    commentRef.value.appendChild(dom)
    console.log(e)

    dom.addEventListener('click', async () => {
      console.log(props.comment)
      emits('deleteComment', props.comment)
    })
  }
}

// const isPraise = ref(false)
// watch(
//   () => props.comment.liked,
//   (newVal) => {
//     isPraise.value = newVal
//   },
//   { immediate: true }
// )

// const route = useRoute()
// const praise = async () => {
//   const { pId } = route.params
//   // const { userId } = store.state.userinfo.userInfo
//   // const cid = props.comment.commentId
//   const { liked, commentId } = props.comment
//   const { code } = await store.dispatch('getInfo', { path: `/comment/like?id=${pId}&cid=${commentId}&t=${liked ? 0 : 1}&type=${props.musicType}` })
//   if (code === 200) {
//     emits('updateInfo')
//     isPraise.value = !isPraise.value
//     ElMessage({
//       type: 'warning',
//       message: '接口异常，实时更新异常'
//     })
//   }
// }
</script>

<style lang="less" scoped>
div.comment-cmp {
  position: relative;
  .el-row.comment {
    width: 100%;
    padding: 15px 0;
    box-sizing: border-box;
    position: relative;

    &.borderTop {
      border-top: 1px solid @borderColor;
    }
    &:hover span.tip-off {
      visibility: visible !important;
    }
    .el-col.user {
      display: flex;
      justify-content: center;
      div.image {
        flex: 0 0 auto;
        position: relative;
        height: 40px;
        width: 40px;
        .el-image {
          position: absolute;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          &.small-icon {
            height: 15px;
            width: 15px;
            right: 0px;
            bottom: 0px;
          }
        }
      }
    }
    .el-col.content {
      font-size: 12px;
      min-height: 40px;
      .flex(space-between, flex-start);
      flex-direction: column;
      @userColor: #507daf;
      div.user-text {
        margin-bottom: 10px;
        padding-right: 20px;
        box-sizing: border-box;
        span.nickname {
          color: @userColor;
          margin-right: 5px;
        }
        .el-image.vip {
          height: 14px;
          vertical-align: middle;
        }
        span.text {
          color: @fontColor;
          margin: 0 0 15px 5px;
          box-sizing: border-box;
          line-height: 20px;
        }
      }
      div.write-back {
        background: #eee;
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        span.nickname {
          color: @userColor;
          margin-right: 10px;
        }
        span.text {
          line-height: 20px;
        }
      }
      .el-row.time-other {
        width: 100%;
        height: 14px;
        line-height: 14px;
        margin-top: 10px;
        .el-col.time {
          color: #bbb;
        }
        .el-col.control {
          color: #666;
          min-width: 200px;
          .flex(space-between, center);
          span {
            // width: 50px;
            flex: 1 1 auto;
            // min-width: ;
            text-align: center;
            &.tip-off {
              visibility: hidden;
            }
            &:not(:last-child) {
              border-right: 1px solid #888;
            }
          }
          i.iconfont {
            font-size: 12px;
            &.icon-zan.praise {
              color: @bgColor;
            }
          }
        }
      }
    }
  }
}
</style>
