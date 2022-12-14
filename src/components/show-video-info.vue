<template>
  <div class="show-video-info">
    <el-row type="flex" class="video-detail" :gutter="20">
      <el-col :span="16" class="video-detail__content">
        <div class="icon pointer" @click="$router.back()">
          <i class="iconfont icon-arrow-left"></i>
          <span>{{ isMv ? 'MV' : '视频' }}详情</span>
        </div>
        <div class="video">
          <video :src="videoSrc" controls ref="videoRef" autoplay="true"></video>
        </div>
        <!-- 作者 -->
        <el-row class="author-attention pointer" type="flex" justify="space-between" align="middle">
          <el-col :span="18" class="image">
            <el-image :src="videoInfo.avatarUrl || videoInfo.cover"></el-image>
            <span class="author">{{ (videoInfo.creator && videoInfo.creator.nickname) || videoInfo.mvCreator }}</span>
          </el-col>
          <el-col :span="4" class="attention pointer">
            <i class="iconfont icon-add"></i>
            <span>关注</span>
          </el-col>
        </el-row>

        <!-- 描述 -->
        <el-row class="description">
          <el-col class="title overflow" :title="videoInfo.title">{{ videoInfo.title || videoInfo.name }}</el-col>
          <el-col class="publishTime-and-playCount default">
            <span class="publish-time">发布时间：{{ publishTime }}</span>
            <span class="play-count">播放：{{ videoInfo._playCount }}次</span>
          </el-col>
          <ul class="tag">
            <li class="tag-item" v-for="item in videoInfo.videoGroup" :key="item.id">{{ item.name }}</li>
          </ul>
        </el-row>

        <ul class="interaction">
          <li class="praise pointer">
            <i class="iconfont icon-zan"></i>
            <span>赞({{ videoInfo.praisedCount }})</span>
          </li>
          <li class="collect pointer">
            <i class="iconfont icon-folder"></i>
            <span>收藏({{ videoInfo.subscribeCount }})</span>
          </li>
          <li class="share pointer">
            <i class="iconfont icon-share"></i>
            <span>分享({{ videoInfo.shareCount }})</span>
          </li>
        </ul>

        <el-row class="comment-container">
          <el-col class="comment-count">
            <h3>评论</h3>
            <span class="count">({{ videoInfo.commentCount }})</span>
          </el-col>
          <div class="textarea">
            <el-input type="textarea" resize="none" v-model="inputValue" always :rows="4" placeholder="接口数据提交异常，后续建设！！！"></el-input>
            <span :class="[{ error: 140 - inputValue.length < 0 }, 'show-textCount']">{{ 140 - inputValue.length }}</span>
          </div>
          <div class="submit">
            <span class="comment-submit pointer" @click="submitComment('')">评论</span>
          </div>
          <div class="good-comments">
            <!-- 评论区域 -->
            <div class="title hot-comment">精彩评论({{ hotCommentList.length }})</div>
            <ul class="comments-content" v-if="hotCommentList.length > 0">
              <li v-for="hotComment in hotCommentList" :key="hotComment.commentId">
                <CommentCmp :comment="hotComment" />
              </li>
            </ul>

            <div class="title new-comment">最新评论({{ commentList.length }})</div>
            <ul class="comments-content" v-if="commentList.length > 0">
              <li v-for="comment in commentList" :key="comment.commentId">
                <CommentCmp :comment="comment" />
              </li>
            </ul>
          </div>
        </el-row>
      </el-col>

      <!-- 右侧 -->
      <el-col :span="8" class="video-recommend">
        <h3>相关推荐</h3>
        <ul>
          <li v-for="video in recommendVideoList" :key="video.vid">
            <RecommendVideo :recommendInfo="video" :isMv="isMv" />
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import CommentCmp from '@/components/comment-cmp.vue'
import { ref, computed, defineProps } from 'vue'
import RecommendVideo from '@/components/recommend-video.vue'

const props = defineProps({
  videoInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  videoSrc: {
    type: String
  },
  hotCommentList: {
    type: Array,
    default: () => []
  },
  commentList: {
    type: Array,
    default: () => []
  },
  recommendVideoList: {
    type: Array,
    default: () => []
  },
  isMv: {
    type: Boolean,
    default: false
  }
})

const inputValue = ref('')

const publishTime = computed(() => {
  const time = props.videoInfo.publishTime
  return new Date(time).toLocaleDateString()
})
</script>

<style lang="less" scoped>
div.show-video-info {
  padding: 10px;
  box-sizing: border-box;
  height: calc(100% - 60px);
  width: 100%;
  .el-row.video-detail {
    .el-col.video-detail__content {
      color: @fontColor;

      div.icon {
        height: 40px;
        font-size: 16px;
        font-weight: 700;
        .flex(flex-start,center);
        i.iconfont {
          font-size: 14px;
          margin-right: 5px;
        }
      }
      div.video {
        video {
          width: 100%;
          height: 310px;
          box-shadow: 0 0 2px #ccc;
        }
      }
      // 作者
      .el-row.author-attention {
        height: 50px;
        margin: 20px 0;
        .el-col.image {
          height: 45px;
          .flex(flex-start,center);
          .el-image {
            flex: 0 0 auto;
            height: 100%;
            width: 45px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
        .el-col.attention {
          background: rgba(250, 28, 28, 0.1);
          .flex(center,center);
          padding: 5px;
          box-sizing: border-box;
          border-radius: 15px;
          color: @bgColor;
          i.iconfont {
            margin-right: 5px;
          }
        }
      }

      .el-row.description {
        .el-col.title {
          font-size: 20px;
          font-weight: bolder;
          cursor: default;
        }
        .el-col.publishTime-and-playCount {
          color: @singerColor;
          font-size: 12px;
          margin: 15px 0;
          span.publish-time {
            margin-right: 20px;
          }
        }
        ul.tag {
          .flex(flex-start,center);
          padding-left: 0;
          overflow: hidden;
          li.tag-item {
            margin-right: 5px;
            background: rgba(111, 111, 111, 0.1);
            padding: 3px 7px;
            white-space: nowrap;
            border-radius: 15px;
            font-size: 12px;
          }
        }
      }

      ul.interaction {
        display: flex;
        padding-left: 0;
        align-items: center;
        flex-direction: row;
        margin: 30px 0;
        & > li {
          border: 1px solid #ccc;
          padding: 7px 15px;
          border-radius: 30px;
          margin-right: 10px;
          & > i.iconfont {
            margin-right: 5px;
          }
        }
      }

      .el-row.comment-container {
        .el-col.comment-count {
          height: 50px;
          margin-bottom: 20px;
          & > h3 {
            font-size: 20px;
            display: inline-block;
          }
          span.count {
            font-size: 12px;
            color: @singerColor;
          }
        }
        div.textarea {
          width: 100%;
          height: 80px;
          position: relative;
          :deep(.el-textarea) {
            height: 100%;
            textarea {
              height: 100%;
              padding: 5px 25px 5px 5px;
              box-sizing: border-box;
              &::-webkit-scrollbar {
                display: none;
              }
            }
          }
          span.show-textCount {
            position: absolute;
            right: 5px;
            bottom: 5px;
            color: #ccc;
            font-size: 12px;
            user-select: none;
            &.error {
              color: @bgColor;
            }
          }
        }
        div.submit {
          width: 100%;
          margin: 10px 0;
          .flex(flex-end,center);
          span.comment-submit {
            border: 1px solid #ccc;
            padding: 5px 15px;
            border-radius: 30px;
          }
        }
        div.good-comments {
          width: 100%;
          div.title {
            font-weight: bolder;
            &.new-comment {
              margin-top: 80px;
            }
          }
          ul.comments-content {
            padding-left: 0;
            :deep(.control span) {
              padding: 0 5px;
            }
          }
        }
      }
    }

    // 右侧
    .el-col.video-recommend {
      & > ul {
        padding-left: 0;
      }
    }
  }
}
</style>
