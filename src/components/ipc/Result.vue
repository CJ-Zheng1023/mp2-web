<template>
  <div class="page page-search" v-loading="pageLoading">
    <search-header :ifSearch=true >
      <div slot="input">
        <el-form :inline=true :model="form">
          <el-form-item>
            <el-input placeholder="请输入IPC号" prefix-icon="el-icon-search" v-model="form.ipc"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">检 索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </search-header>
    <div class="main">
      <el-row :gutter="30">
        <el-col :span="8" v-if="ipcResult">
          <div class="ipc-explain">
            <el-card class="box-card">
              <span slot="header" class="card-header-ipc">{{ipcResult.IC}}的中文含义</span>
              <div class="card-body" v-html="utcnHtml">
              </div>
            </el-card>
            <el-card class="box-card">
              <span slot="header" class="card-header-ipc">{{ipcResult.IC}}的英文含义</span>
              <div class="card-body" v-html="utenHtml">
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8" v-else>
          <el-card class="box-card">
            <p>空空如也~</p>
          </el-card>
        </el-col>
        <el-col :span="16" v-if="patentList">
          <div class="patent-list" v-show="!dialogVisible" v-loading="patentLoading">
            <el-row :gutter="15">
              <el-col v-for="patent in patentList" :key="patent.NRD_AN" :span="8">
                <el-card class="box-card">
                  <div slot="header" class="card-header-patent">
                    <i class="fa fa-expand" @click="showDialog(patent)"></i>
                  </div>
                  <div class="card-body">
                    <p class="an" :class="[patent.marked=='true' ? 'done' : '']">{{patent.NRD_AN}}</p>
                    <el-tooltip placement="bottom-start">
                      <span slot="content">{{patent.TI}}</span>
                      <p class="ti">{{patent.TI}}</p>
                    </el-tooltip>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="24">
                <div class="pagination">
                  <el-pagination
                    @current-change="clickPagination"
                    background
                    :current-page="currentPage"
                    layout="prev, pager, next"
                    :page-size="pagination.size"
                    :total="pagination.total">
                  </el-pagination>
                </div>
              </el-col>
            </el-row>
          </div>
          <patent-dialog v-show="dialogVisible" @unmark="unmarkPatent" @mark="markPatent" :ipc="ipcResult.IC" :message="message" @prev="prevPatent" @next="nextPatent" :patent="currentPatent" @close="dialogVisible=false" :visible="dialogVisible"></patent-dialog>
        </el-col>
        <el-col :span="16" v-else>
          <el-card class="box-card">
            <p>空空如也~</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import SearchHeader from '../SearchHeader'
import PatentDialog from './PatentDialog'
import { mapState, mapActions } from 'vuex'
import cache from '../../assets/scripts/cache'
export default {
  name: 'Result',
  data () {
    return {
      form: {
        ipc: ''
      },
      dialogVisible: false,
      currentPatent: {},
      message: '',
      patentLoading: false,
      pageLoading: false
    }
  },
  computed: {
    currentPage () {
      let pagination = this.pagination
      return (pagination.start + pagination.size) / pagination.size
    },
    utcnHtml () {
      let arr = this.ipcResult.UTCN.split(';')
      let html = '<div class="ipc-content">'
      for (let i = 0, len = arr.length - 1; i < len; i++) {
        if (i === arr.length - 2) {
          html += `<p style="color: #409EFF;">${arr[i]}</p>`
        } else {
          html += `<p>${arr[i]}</p>`
        }
      }
      html += '</div>'
      return html
    },
    utenHtml () {
      let arr = this.ipcResult.UTEN.split(';')
      let html = '<div class="ipc-content">'
      for (let i = 0, len = arr.length - 1; i < len; i++) {
        if (i === arr.length - 2) {
          html += `<p style="color: #409EFF;">${arr[i]}</p>`
        } else {
          html += `<p>${arr[i]}</p>`
        }
      }
      return html
    },
    ...mapState('ipcModule', [
      'ipcResult',
      'patentList',
      'pagination'
    ])
  },
  methods: {
    showDialog (patent) {
      this.currentPatent = patent
      this.dialogVisible = true
    },
    clickPagination (curPage) {
      this.patentLoading = true
      this.searchPatentList({
        ipc: this.form.ipc.replace(/\//g, '-'),
        size: this.pagination.size,
        start: (curPage - 1) * this.pagination.size
      }).then(() => {
        this.patentLoading = false
      })
    },
    onSubmit () {
      let ipc = this.form.ipc
      this.$router.push({path: `/ipc/search/${ipc.replace(/\//g, '-')}`})
    },
    prevPatent () {
      let index = this._getCurrentPatentIndex()
      if (index === 0) {
        this.message = `已经是第一篇文献了:${+new Date()}`
      } else {
        this.message = ''
        this._setCurrentPatent(index - 1)
      }
    },
    nextPatent () {
      let index = this._getCurrentPatentIndex()
      if (index === this.patentList.length - 1) {
        this.message = `已经是最后一篇文献了:${+new Date()}`
      } else {
        this.message = ''
        this._setCurrentPatent(index + 1)
      }
    },
    _getCurrentPatentIndex () {
      return this.patentList.indexOf(this.currentPatent)
    },
    _setCurrentPatent (index) {
      this.currentPatent = this.patentList[index]
    },
    markPatent () {
      this.currentPatent.marked = 'true'
    },
    unmarkPatent () {
      this.currentPatent.marked = 'false'
    },
    ...mapActions('ipcModule', [
      'searchPatentList',
      'search'
    ])
  },
  components: {
    SearchHeader,
    PatentDialog
  },
  beforeRouteUpdate (to, from, next) {
    let ipc = to.params.ipc
    this.form.ipc = ipc.replace(/-/g, '/')
    this.pageLoading = true
    this.search(ipc).then(() => {
      cache.cacheIpc(ipc)
      this.pageLoading = false
    })
    next()
  },
  created () {
    let ipc = this.$route.params.ipc
    this.form.ipc = ipc.replace(/-/g, '/')
    this.pageLoading = true
    this.search(ipc).then(() => {
      cache.cacheIpc(ipc)
      this.pageLoading = false
    })
  }
}
</script>
<style scoped>
  .patent-list, .ipc-explain{
    padding: 15px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
  .box-card{
    margin-bottom: 20px;
  }
  .box-card .card-header-patent{
    text-align: right;
  }
  .box-card .card-header-patent i{
    font-size: 14px;
    color: #a0a0a0;
    cursor: pointer;
  }
  .card-body .an, .card-header-ipc{
    color: #0366d6;
    font-size: 16px;
    font-weight: 600;
  }
  .card-body .an, .card-body .ti{
    margin-top: 0;
  }
  .card-body .an.done{
    color: #767e8d;
  }
  .card-body{
    font-size: 14px;
    line-height: 20px;
  }
  .card-body .ti{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .pagination{
    text-align: right;
  }
</style>
