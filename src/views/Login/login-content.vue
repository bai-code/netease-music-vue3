<template>
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
import { ref, reactive, onActivated, defineProps, onDeactivated } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  redirectToPath: {
    type: String
  }
})

const store = useStore()
const router = useRouter()

const dialogVisible = ref(true)
onActivated(() => {
  // 处理取消后再次进入登录页面弹窗消失
  dialogVisible.value = true
})

// form表单区域
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
      const { redirectToPath } = props
      if (redirectToPath) {
        router.push({ path: redirectToPath })
      } else {
        router.back()
      }
    } else {
      console.log('error submit!')
    }
  })
  dialogVisible.value = false
  formEl.resetFields()
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
    router.back()
    done()
    return
  }
  ElMessageBox.confirm('已经填写账号 / 密码，是否关闭？？？？')
    .then(() => {
      done()
      router.back()
    })
    .catch(() => {
      // catch error
    })
}

onDeactivated(() => {
  dialogVisible.value = false
})
</script>
