<template>
  <div class="login register">
    <div class="left-wrap">
      <left-view></left-view>
    </div>
    <div class="right-wrap">
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconsys-zhaopian-copy"></use>
        </svg>
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3 class="title">{{ $t('register.title') }}</h3>
          <p class="sub-title">{{ $t('register.subTitle') }}</p>
          <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
            <!-- 昵称 -->
            <el-form-item prop="nickname">
              <el-input v-model.trim="formData.nickname" placeholder="昵称" size="large" />
            </el-form-item>
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input v-model.trim="formData.username" placeholder="用户名" size="large" />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model.trim="formData.password"
                placeholder="密码"
                size="large"
                type="password"
                autocomplete="off"
              />
            </el-form-item>
            <!-- 确认密码 -->
            <el-form-item prop="confirmPassword">
              <el-input
                v-model.trim="formData.confirmPassword"
                placeholder="确认密码"
                size="large"
                type="password"
                autocomplete="off"
                @keyup.enter="register"
              />
            </el-form-item>
            <!-- 性别 -->
            <el-radio-group v-model="formData.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
            <div>
              <el-button
                class="register-btn"
                size="large"
                type="primary"
                @click="register"
                :loading="loading"
                v-ripple
              >
                {{ $t('register.submitBtnText') }}
              </el-button>
            </div>

            <div class="footer">
              <p>
                {{ $t('register.hasAccount') }}
                <router-link to="/login">{{ $t('register.toLogin') }}</router-link>
              </p>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LeftView from '@/components/Pages/Login/LeftView.vue'
  import AppConfig from '@/config'
  import { UserService } from '@/api/usersApi'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { ApiStatus } from '@/utils/http/status'

  const router = useRouter()
  const formRef = ref<FormInstance>()

  const systemName = AppConfig.systemInfo.name
  const loading = ref(false)

  const formData = reactive({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    gender: ''
  })

  // 密码强度验证
  const validateStrongPassword = (password: string): boolean => {
    const hasNumber = /[0-9]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasSpecial = /[!@#%&(){};':",.<>?]/.test(password)
    const minLength = 8 // 你可以根据需要设置最小长度

    return hasNumber && hasUpper && hasLower && hasSpecial && password.length >= minLength
  }

  const validatePass = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('密码不能为空'))
    } else if (!validateStrongPassword(value)) {
      callback(new Error('密码应包含数字、大写字母、小写字母、特殊字符')) // 密码强度不足提示
    } else {
      if (formData.confirmPassword !== '') {
        formRef.value?.validateField('confirmPassword')
      }
      callback()
    }
  }

  const validatePass2 = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('确认密码不能为空'))
    } else if (value !== formData.password) {
      callback(new Error('两次输入的密码不匹配'))
    } else {
      callback()
    }
  }

  const validateGender = (rule: any, value: number, callback: any) => {
    if (value === null) {
      callback(new Error('请选择性别')) // 请选择性别
    } else {
      callback()
    }
  }

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      { min: 3, max: 32, message: '用户名长度应在3-32位', trigger: 'blur' },
      {
        pattern: /^[\p{L}\p{N}]+$/u,
        message: '昵称只能包含字母和数字', // 只允许字母和数字
        trigger: 'blur'
      }
    ],
    nickname: [
      { required: true, message: '昵称不能为空', trigger: 'blur' },
      { min: 5, max: 24, message: '昵称长度应在5-24位', trigger: 'blur' }
    ],
    password: [
      { required: true, validator: validatePass, trigger: 'blur' },
      { min: 8, max: 64, message: '密码长度应在8-64位', trigger: 'blur' }
    ],
    confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
    gender: [{ required: true, validator: validateGender, trigger: 'change' }]
  })

  const register = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      loading.value = true

      const res = await UserService.register({
        data: JSON.stringify({
          nickname: formData.nickname,
          username: formData.username,
          password: formData.password,
          gender: formData.gender
        })
      })

      if (res.code === ApiStatus.success) {
        ElMessage.success('注册成功')
        loading.value = false
        setTimeout(() => {
          toLogin()
        }, 1000) // 1000毫秒后执行
      }
    } catch (error) {
      console.log('验证失败', error)
    }
  }

  const toLogin = () => {
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
</script>

<style lang="scss" scoped>
  @use '../login/index' as login;
  @use './index' as register;
</style>
