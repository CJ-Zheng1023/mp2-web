<template>
  <div class="page page-search">
    <search-header :ifSearch=false ></search-header>
    <div class="main">
      <el-card>
        <el-form :model="form" :inline="true" ref="form" label-width="80px">
          <el-form-item label="IPC号">
            <el-input v-model="form.ipc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">检 索</el-button>
          </el-form-item>
        </el-form>
        <div class="tags">
          <div class="tag-item" @click="setFormIpc(ipc)" v-for="ipc in historyIpcs" :key="ipc">
            <el-tag type="primary">{{ipc}}</el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import SearchHeader from '../SearchHeader'
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      form: {
        ipc: ''
      },
      historyIpcs: []
    }
  },
  computed: {
    ...mapState('ipcModule', [
      'ipcResult'
    ])
  },
  components: {
    SearchHeader
  },
  methods: {
    ...mapActions('ipcModule', [
      'search'
    ]),
    onSubmit () {
      let ipc = this.form.ipc
      this.$router.push({path: `/ipc/search/${ipc.replace(/\//g, '-')}`})
    },
    setFormIpc (ipc) {
      this.form.ipc = ipc
    }
  },
  created () {
    let cache = window.localStorage.getItem('history_ipcs')
    if (cache) {
      Array.prototype.push.apply(this.historyIpcs, cache.split(','))
    }
  }
}
</script>
<style scoped>
  .el-form{
    text-align: center;
    margin-top: 200px;
  }
  .el-input{
    width: 400px;
  }
  .tags{
    width: 430px;
    margin: 0 auto 150px auto;
  }
  .tag-item{
    display: inline-block;
    margin-right: 10px;
  }
  .el-tag{
    margin-bottom: 5px;
    cursor: pointer;
  }
</style>
