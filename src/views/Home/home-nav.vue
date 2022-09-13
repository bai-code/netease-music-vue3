<template>
  <el-row type="flex" justify="space-between" align="middle">
    <el-col :span="5">
      <div class="logo pointer"></div>
    </el-col>
    <el-col :span="5">
      <el-autocomplete v-model="inputValue" :fetch-suggestions="querySearch" :trigger-on-focus="false" clearable class="inline-input" placeholder="请输入歌名/歌手" @select="handleSelect" />
    </el-col>
    <el-col :span="5" class="avatar">
      <div class="avatar-bg">
        <img :src="userInfo.avatarUrl" alt="" />
      </div>
      <div class="userInfo">
        <p class="overflow pointer" @click="spreadControls" v-if="userInfo.token">{{ userInfo.nickname }}</p>
        <p class="overflow pointer" @click="loginIn" v-else>{{ userInfo.nickname }}</p>
        <input type="text" @focus="inputFocus" @blur="inputBlur" ref="inputRef" class="_useIsSpread" />
        <ul class="control" v-if="userInfo.token && isSpread">
          <li class="pointer">用户信息</li>
          <li class="pointer" @click="logout">退出登录</li>
        </ul>
      </div>
    </el-col>
  </el-row>

  <!-- 登录弹窗 -->
  <Teleport to="body">
    <el-dialog v-model="dialogVisible" width="50%" :before-close="handleClose">
      <template #header>
        <div class="dialog-header">登录</div>
      </template>
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="ruleForm.phone" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        </span>
      </template>
    </el-dialog>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'

const store = useStore()
const isSpread = ref(false) // 是否展开
const inputRef = ref()
const timer = ref()
const inputValue = ref('')

const userInfo = computed(() => {
  return store.state.userinfo.userInfo
})

const handleSelect = (item) => {
  console.log(item)
}

const inputFocus = () => {
  isSpread.value = true
}
const inputBlur = () => {
  timer.value = setTimeout(() => {
    isSpread.value = false
  }, 150)
}

const loginIn = () => {
  dialogVisible.value = true
}
const spreadControls = () => {
  if (isSpread.value) {
    inputBlur()
  } else {
    inputRef.value.focus()
  }
}

onBeforeUnmount(() => {
  clearTimeout(timer.value)
  timer.value = null
})

const logout = async () => {
  const flag = await store.dispatch('userinfo/userLogout')
  ElMessage({
    type: flag ? 'success' : 'error',
    message: flag ? '退出登录成功' : '退出登录失败'
  })
  // console.log(flag)
}

const restaurants = ref([])
const querySearch = (queryString, cb) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' }
  ]
}

// 登录
const dialogVisible = ref(false)

// form表单区域
// const formRef = ref()

const ruleFormRef = ref()

const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号码！！！'))
  } else {
    if (ruleForm.phone !== '') {
      if (!ruleFormRef.value) return
      const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (!reg.test(value)) {
        callback(new Error('号码有误'))
      } else {
        callback()
      }
    }
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const reg = /\w{6,16}/
    if (!reg.test(value)) {
      callback(new Error('密码不符合规范'))
    } else {
      callback()
    }
  }
}

const ruleForm = reactive({
  phone: '13735544745',
  password: 'bgf1580087304'
})

const rules = reactive({
  phone: [{ validator: validatePhone, trigger: 'blur' }, { required: true }],
  password: [{ validator: validatePassword, trigger: 'blur' }, { required: true }]
})

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const flag = await store.dispatch('userinfo/userLogin', ruleForm)
      ElMessage({
        type: flag ? 'success' : 'error',
        message: flag ? '登录成功' : 'error'
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
  dialogVisible.value = false
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleClose = (done) => {
  let flag = false
  for (const prop in ruleForm) {
    if (ruleForm[prop]) {
      flag = true
    }
  }
  if (!flag) {
    done()
    return
  }
  ElMessageBox.confirm('已经填写账号/ 密码，是否关闭？？？？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

onMounted(() => {
  restaurants.value = loadAll()
})
</script>

<style lang="less" scoped>
.el-row {
  height: 100%;
  .el-col {
    div.logo {
      .bgSrc('~@/static/tabbar.png',0,-15px);
      height: 40px;
    }
    /deep/.el-autocomplete.inline-input {
      .el-input__wrapper {
        border-radius: 30px !important;
        background-color: rgba(100, 100, 100, 0.1);
        box-shadow: none;
        input {
          color: @contrastColor;
          font-size: 12px;
          &::placeholder {
            color: inherit;
          }
        }
        .el-input__suffix {
          color: @contrastColor;
        }
      }
    }

    &.avatar {
      .flex(flex-start,center);
      div.avatar-bg {
        background: #fff;
        border-radius: 50%;
        height: 37px;
        width: 37px;
        .flex(center,center);
        img {
          height: 35px;
          width: 35px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
      div.userInfo {
        position: relative;
        flex: 0 0 auto;
        width: calc(100% - 40px);
        padding-left: 10px;
        box-sizing: border-box;
        p {
          color: @contrastColor;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
          &:hover {
            text-decoration: underline;
          }
        }
        input._useIsSpread {
          position: absolute;
          height: 0;
          width: 0;
          opacity: 0;
        }
        ul.control {
          position: absolute;
          font-size: 14px;
          padding: 5px 30px 5px 10px;
          box-shadow: 0 0 10px @borderColor;
          border-radius: 3px;
          top: 35px;
          background: @contrastColor;
          z-index: 9999;
          &:before,
          &:after {
            content: '';
            position: absolute;
            border: 10px solid;
            border-color: transparent transparent @borderColor transparent;
            left: 20px;
          }
          &::before {
            top: -21px;
          }
          &::after {
            top: -20px;
            border-color: transparent transparent @contrastColor transparent;
          }
          & > li {
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
  }
}
.el-dialog {
  border-radius: 5px !important;
  div.dialog-header {
    text-align: center;
    font-size: 20px;
    font-weight: bolder;
    letter-spacing: 5px;
  }
}
</style>
