<template>
  <div class="navbar">
    <div class="logo">
      <h3>标引平台</h3>
    </div>
    <div v-if="ifSearch" class="input-wrapper">
      <slot name="input"></slot>
    </div>
    <div class="dropdown-wrapper">
      <el-dropdown trigger="click" @command="dropdownCommand">
      <span class="el-dropdown-link">
        {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>排行榜</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'SearchHeader',
  props: [
    'ifSearch'
  ],
  data () {
    return {
      username: window.localStorage.getItem('username')
    }
  },
  methods: {
    ...mapActions('userModule', [
      'deleteToken'
    ]),
    dropdownCommand (command) {
      if (command === 'logout') {
        this.deleteToken().then((data) => {
          if (data.flag) {
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('userId')
            window.localStorage.removeItem('username')
            this.$router.push({path: `/login`})
          } else {
            this.$message({
              type: 'error',
              message: '退出失败'
            })
          }
        })
      }
    }
  }
}
</script>
<style>
  .navbar{
    height: 54px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 0 80px;
    overflow: hidden;
  }
  .navbar .logo h3{
    line-height: 54px;
    padding: 0;
    margin: 0;
    color: #007fff;
    font-size: 25px;
    float: left;
  }
  .navbar .input-wrapper{
    margin: 5px 0 0 180px;
    float: left;
  }
  .navbar .dropdown-wrapper{
    margin-top: 15px;
    float: right;
  }
  .el-dropdown-link{
    cursor: pointer;
  }
</style>
