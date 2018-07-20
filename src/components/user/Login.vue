<template>
  <div class="page page-login">
    <div class="form-wrapper">
      <h3>用户登录</h3>
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
            登 录
            <i class="fa fa-arrow-circle-o-right"></i>
          </el-button>
        </el-form-item>
      </el-form>
      <div class="register">
        <p>
          <router-link to="/register" tag="a">注册新用户</router-link>
        </p>
      </div>
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
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('userModule', [
      'loginCode', 'user', 'token'
    ])
  },
  methods: {
    submitForm (formName) {
      this.ifLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login({
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }).then(() => {
            let code = Number(this.loginCode)
            if (code === 2) {
              this.$notify.error({
                title: '错误信息',
                message: '您输入的账号不存在'
              })
            } else if (code === 3) {
              this.$notify.error({
                title: '错误信息',
                message: '您输入的用户名或密码有误'
              })
            } else {
              window.localStorage.setItem('token', this.token)
              window.localStorage.setItem('userId', this.user.id)
              window.localStorage.setItem('username', this.user.username)
              this.$router.push({path: '/'})
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
      'login'
    ])
  }
}
</script>
<style scoped>
  .register{
    padding-top: 10px;
    border-top: 1px dotted #fff;
  }
  .register > p{
    font-size: 13px;
    text-align: right;
  }
  .register > p > a{
    color: #333;
    text-decoration: none;
  }
  .page.page-login{
    position: relative;
    min-height: 450px;
  }
</style>
