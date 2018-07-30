<template>
  <div class="navbar">
    <i class="fa fa-bars btn-menu" tabindex="-1" @click="open"></i>
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
    <div class="side-menu" :class="{open: isOpen}" ref="sideMenu" tabindex="-1">
      <div class="menu-header">
        <i class="fa fa-close" @click="close"></i>
      </div>
      <div class="menu-body">
        <ul>
          <li class="menu-item">
            <a href="javascript:;" @click="toPage('/')">首页</a>
          </li>
          <li class="menu-item">
            <a href="javascript:;" @click="toPage('/address')">地址标引</a>
          </li>
          <li class="menu-item">
            <a href="javascript:;" @click="toPage('/ipc')">IPC标引</a>
          </li>
          <li class="menu-item">
            <a href="javascript:;" @click="toPage('/keyword')">关键词标引</a>
          </li>
        </ul>
      </div>
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
      username: window.localStorage.getItem('username'),
      isOpen: false
    }
  },
  methods: {
    ...mapActions('userModule', [
      'deleteToken'
    ]),
    open () {
      this.isOpen = true
      this.$refs.sideMenu.focus()
    },
    close () {
      this.isOpen = false
    },
    toPage (source) {
      if (source === '/keyword') {
        this.$alert('功能未开放，敬请期待！', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
        return
      }
      this.$router.push({path: source})
    },
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
  .navbar .logo{
    float: left;
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
  .navbar .btn-menu{
    line-height: 54px;
    float: left;
    margin-left: -40px;
    cursor: pointer;
  }
  .navbar .btn-menu:focus{
    outline: none;
  }
  .side-menu{
    left: -220px;
    position: fixed;
    top: 0;
    bottom: 0;
    width: 220px;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 10000;
    border-right: 1px solid rgb(233, 233, 233);
    transition: left .5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .side-menu:focus{
    outline: none;
  }
  .side-menu.open{
    left: -20px;
  }
  .side-menu .menu-header{
    padding: 10px;
    text-align: right;
  }
  .side-menu .menu-header i{
    cursor: pointer;
    font-size: 20px;

  }
  .side-menu .menu-body{
    padding: 20px 0;
  }
  .side-menu .menu-body ul{
    margin: 0;
    padding-left: 20px;
  }
  .side-menu .menu-body ul li{
    list-style: none;
  }
  .menu-item{
    margin-top: 30px;
  }
  .menu-item a{
    text-align: center;
    color: #606266;
    font-size: 20px;
    line-height: 40px;
    display: block;
    text-decoration: none;
  }
</style>
