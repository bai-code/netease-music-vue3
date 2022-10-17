<template>
  <div class="comment">
    <el-row class="comment-submit">
      <el-col class="textarea">
        <el-input type="textarea" :rows="3" v-model="textarea" placeholder="实时更新接口异常，建设中......" resize="none"></el-input>
        <span :class="[{ warn: textarea.length > 150 }, 'countNum']">{{ 150 - textarea.length }}</span>
      </el-col>
      <span class="btn pointer" @click="sendComment">评论</span>
    </el-row>

    <el-row v-if="hotCommentsData.length > 0">
      <h4 class="hotComments">精彩评论({{ hotCommentsData.length }})</h4>
      <el-col>
        <CommentCmp v-for="(comment, index) in hotCommentsData" :key="comment.id" :comment="comment" @updateInfo="updateInfo" :isBorderTop="index !== 0" @deleteComment="deleteComment" />
      </el-col>
    </el-row>

    <el-row v-if="commentsData.length > 0">
      <h4 class="comments">最新评论({{ totalNum }})</h4>
      <el-col>
        <CommentCmp v-for="(comment, index) in showCommentData" :key="comment.id" :comment="comment" :isBorderTop="index !== 0" @deleteComment="deleteComment" @updateInfo="updateInfo" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, reactive } from 'vue'
import { useStore } from 'vuex'
import CommentCmp from '@/components/comment-cmp.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  mId: {
    type: String
  }
})

const showCommentData = ref([])

const commentsData = reactive([])
const hotCommentsData = reactive([])
const totalNum = ref(100)
const isMore = ref(true)
const isMoreHot = ref(true)
const store = useStore()
const getCommentData = async ({ mId, isUpdate = false }) => {
  const id = mId || props.mId || 0
  const len = commentsData.length
  const limit = 50
  const {
    total,
    more,
    moreHot,
    comments = [],
    hotComments = []
  } = await store.dispatch('getInfo', {
    path: `/comment/playlist?id=${id}&offset=${isUpdate ? len - limit : len}&limit=${limit}
  `
  })
  if (isUpdate) {
    if (isMore.value) {
      commentsData.splice(len - limit, 0, ...comments)
      showCommentData.value = comments
    }
    if (isMoreHot.value) {
      hotCommentsData.splice(len - limit, 0, ...hotComments)
    }
  } else {
    if (isMore.value) {
      showCommentData.value = comments
      commentsData.push(...comments)
      isMore.value = more
      totalNum.value = total
    }
    if (isMoreHot.value) {
      hotCommentsData.push(...hotComments)
      isMoreHot.value = moreHot
    }
  }
}

watch(
  () => props.mId,
  (mId) => {
    getCommentData({ mId })
    // console.log('F', commentData, mId)
  },
  { immediate: true }
)

const textarea = ref('')

const sendComment = async () => {
  const { code } = await store.dispatch('getInfo', { path: `/comment?t=1&id=${props.mId}&type=2&content=${textarea.value}` })
  if (code === 200) {
    getCommentData({ isUpdate: true })
  } else {
    ElMessage({
      type: 'warning',
      message: '实时更新异常，请稍后刷新查看'
    })
  }
  // console.log(res)
}

const deleteComment = async (comment) => {
  const res = await store.dispatch('getInfo', { path: `/comment?t=0&id=${props.mId}&type=2&commentId=${comment.commentId}` })
  console.log(res)
}

const updateInfo = () => {
  // setTimeout(() => {
  getCommentData({ isUpdate: true })
  // }, 5000)
}
</script>

<style scoped lang="less">
div.comment {
  width: 100%;
  .el-row.comment-submit {
    .flex(flex-start,flex-end);
    flex-direction: column;
    .el-col.textarea {
      // flex: 0 0 auto;
      width: 100%;
      position: relative;
      :deep(.el-textarea) {
        textarea {
          padding-right: 40px;
          box-sizing: border-box;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
      span.countNum {
        position: absolute;
        right: 10px;
        bottom: 10px;
        color: #999;
        &.warn {
          color: @bgColor;
        }
      }
    }
    span.btn {
      border: 1px solid @borderColor;
      margin-top: 15px;
      padding: 5px 15px;
      border-radius: 15px;
      &:hover {
        background: @hoverColor;
      }
    }
  }
}
</style>
