<template>
  <div class="page page-register">
    <div class="form-wrapper">
      <h3>用户注册</h3>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="username" class="form-item">
          <i class="fa fa-user"></i>
          <el-input v-model="ruleForm.username" class="input-icon"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="form-item">
          <i class="fa fa-lock"></i>
          <el-input type="password" v-model="ruleForm.password" class="input-icon"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="ifLoading" class="btn-submit" size="small" type="primary" @click="submitForm('ruleForm')">
            注 册
            <i class="fa fa-user-plus"></i>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      ifLoading: false,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapState('userModule', [
      'registerCode'
    ])
  },
  methods: {
    submitForm (formName) {
      this.ifLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.register({
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }).then(() => {
            let code = Number(this.registerCode)
            if (code === 2) {
              this.$notify.error({
                title: '错误信息',
                message: '您输入的账号已被占用'
              })
            } else {
              this.$alert('注册成功，请您在登录页面登录', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({path: '/'})
                }
              })
            }
            this.ifLoading = false
          })
        } else {
          this.ifLoading = false
          return false
        }
      })
    },
    ...mapActions('userModule', [
      'register'
    ])
  }
}
</script>
