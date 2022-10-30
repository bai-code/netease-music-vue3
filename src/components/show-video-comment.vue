<template>
  <el-row class="show-video-comment">
    <el-col :span="3" class="img-content">
      <img :src="comment.user.avatarUrl" alt="" class="el-image" />
    </el-col>
    <el-col :span="21" class="comment">
      <!-- 评论 -->
      <div class="comment">
        <div class="nickname">{{ comment.user.nickname }}</div>
        <div class="img" v-if="comment.user.vipRights">
          <img v-if="comment.user.vipRights.associator" v-lazy="comment.user.vipRights.associator.iconUrl" alt="" />
        </div>
        <div class="content">：{{ comment.content }}</div>
      </div>

      <ul class="reply" v-if="comment.beReplied.length">
        <li v-for="info in comment.beReplied" :key="info.beRepliedCommentId">
          <span class="nickname">@{{ info.user.nickname }}：</span>
          <span class="ct">{{ info.content }}</span>
        </li>
      </ul>

      <div class="other">
        <div class="time">{{ publishTime }}</div>
        <div class="controls">
          <span class="inform icon pointer">举报</span>
          <span class="icon pointer">
            <i class="iconfont icon-zan"></i>
          </span>
          <span class="icon pointer">
            <i class="iconfont icon-share"></i>
          </span>
          <span class="icon pointer">
            <i class="iconfont icon-comment"></i>
          </span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  comment: {
    type: Object
  }
})

const publishTime = computed(() => {
  const d = props.comment.time
  const timeStr = props.comment.timeStr
  const date = timeStr + ' ' + new Date(d).toLocaleTimeString().substr(0, 5)
  return date
})

// console.log(publishTime)
</script>

<style lang="less" scoped>
.el-row.show-video-comment {
  margin-top: 25px;
  &:hover span.inform {
    visibility: visible !important;
  }
  .el-col.img-content {
    .el-image {
      height: 40px;
      width: 40px;
      border-radius: 50%;
    }
  }
  .el-col.comment {
    div.comment {
      font-size: 12px;
      line-height: 16px;
      & > div {
        display: inline;
        &.nickname {
          color: @userColor;
        }
        &.img {
          height: 12px;
          margin: 0 5px;
          img {
            height: inherit;
            vertical-align: middle;
          }
        }
      }
    }

    ul.reply {
      padding: 10px;
      border: 1px solid #ddd;
      background: #eee;
      border-radius: 5px;
      margin: 5px;
      font-size: 12px;
      & > li {
        span.nickname {
          color: @userColor;
        }
      }
    }

    div.other {
      font-size: 12px;
      margin-top: 20px;
      .flex(space-between, center);
      div.time {
        color: #bbb;
      }
      div.controls {
        .flex(space-around,center);
        width: 160px;
        span.icon {
          color: #aaa;
          padding: 0 10px;
          &:hover {
            color: #888;
          }
          &:not(:last-child) {
            border-right: 1px solid #ccc;
          }
          &:nth-child(1) {
            visibility: hidden;
          }
          i.iconfont {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
