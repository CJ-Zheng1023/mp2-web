<script src="../../store/modules/comp.js"></script>
<template>
  <div class="page page-search" v-loading="pageLoading">
    <search-header :ifSearch=true>
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
        <el-col :span="8" v-if="compIpcResult">
          <div class="an-list">
            <el-row :gutter="10">
              <el-table
                :data="compIpcResult"
                border
                style="width: 100%" @row-click="openDetails" :row-class-name="tableRowClassName" :row-style="selectHighLight" :header-cell-style="{'background-color': '#5C5CD6','color': 'white'}">
                <el-table-column prop="an" label="申请号" width="150" class="table-item"></el-table-column>
                <el-table-column  label="对比文献">
                  <el-table-column prop="citedAn" label="申请号" width="150" class="table-item"></el-table-column>
                  <el-table-column prop="citeType" label="类型" class="table-item"></el-table-column>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row :gutter="10">
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
        </el-col>
        <el-col :span="8" v-else>
          <el-card class="box-card">
            <p>空空如也~</p>
          </el-card>
        </el-col>
        <el-col :span="16">
          <div class="patent-detail" v-loading="patentLoading">
            <el-row><el-button-group class="prev-next-btn"><el-button type="primary" plain  @click="prev" class="prev-patent" icon="el-icon-arrow-left">上一篇</el-button><el-button type="primary" plain  @click="next" class="next-patent">下一篇<i class="el-icon-arrow-right el-icon--right"></i></el-button></el-button-group></el-row>
            <div class="comp-main">
              <el-row :gutter="20">
                <el-col :span="12" class="selfpatentBaseInfo">
                  <div class="card">
                    <div  class="head">
                      <span>本申请专利</span>
                    </div>
                    <div class="card-main">
                      <div class="base">
                        <div class="baseinfo">
                          <div class="patent-item">
                            <label>申请号:</label>
                            <div class="content">{{this.selfpatentBaseInfo.NRD_AN}}</div>
                          </div>
                          <div class="patent-item">
                            <label>分类号:</label>
                            <div class="content"  v-if="this.compIpcResult[this.index]">{{this.compIpcResult[this.index].apIpc}}</div>
                          </div>
                          <div class="patent-item">
                            <label>发明人:</label>
                            <div class="content">{{this.selfpatentBaseInfo.IN}}</div>
                          </div>
                          <div class="patent-item">
                            <label>申请人:</label>
                            <div class="content">{{this.selfpatentBaseInfo.PA}}</div>
                          </div>
                          <div class="patent-item">
                            <label>国省代码:</label>
                            <div class="content">{{this.selfpatentBaseInfo.CNAME}}</div>
                          </div>
                        </div>
                      </div>
                      <div class="grid-content bg-purple">
                        <el-collapse v-model="activeNames" accordion>
                          <el-collapse-item title="发明名称" name="1">
                            <div v-html="this.selfpatentBaseInfo.TI">
                            </div>
                          </el-collapse-item>
                          <el-collapse-item title="说明书" name="2">
                            <div v-html="this.selfpatentBaseInfo.DESC">
                            </div>
                          </el-collapse-item>
                          <el-collapse-item title="权力要求" name="3">
                            <div v-html="selfCLMS"></div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12"  v-if="citepatentBaseInfo" class="citepatentBaseInfo">
                  <div class="card">
                    <div class="head">
                      <span>对比文献专利</span>
                    </div>
                    <div class="card-main">
                      <div class="base">
                        <div class="baseinfo">
                          <div class="patent-item">
                            <label>申请号:</label>
                            <div class="content">{{this.citepatentBaseInfo.NRD_AN}}</div>
                          </div>
                          <div class="patent-item">
                            <label>分类号:</label>
                            <div class="content" v-if="this.compIpcResult[this.index].cIpc">{{this.compIpcResult[this.index].cIpc}}</div>
                          </div>
                          <div class="patent-item">
                            <label>发明人:</label>
                            <div class="content">{{this.citepatentBaseInfo.IN}}</div>
                          </div>
                          <div class="patent-item">
                            <label>申请人:</label>
                            <div class="content">{{this.citepatentBaseInfo.PA}}</div>
                          </div>
                          <div class="patent-item">
                            <label>国省代码:</label>
                            <div class="content">{{this.citepatentBaseInfo.CNAME}}</div>
                          </div>
                        </div>
                      </div>
                      <div class="grid-content bg-purple-light">
                        <el-collapse v-model="activeNames" accordion>
                          <el-collapse-item title="发明名称" name="1">
                            <div v-html="this.citepatentBaseInfo.TI"></div>
                          </el-collapse-item>
                          <el-collapse-item title="说明书" name="2">
                            <div v-html="this.citepatentBaseInfo.DESC"></div>
                          </el-collapse-item>
                          <el-collapse-item title="权力要求" name="3">
                            <div v-html="citeCLMS"></div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </div>
                    </div>
                </el-col>
                <el-col :span="12"  v-else>
                  <el-card class="box-card">
                    <p>空空如也~</p>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import SearchHeader from '../SearchHeader'
import { mapState, mapActions } from 'vuex'
import cache from '../../assets/scripts/cache'
export default {
  name: 'compResult',
  data () {
    return {
      form: {
        ipc: ''
      },
      patentLoading: false,
      pageLoading: false,
      activeNames: ['1'],
      index: 0,
      message: ''
    }
  },
  computed: {
    currentPage () {
      let pagination = this.pagination
      return (pagination.start + pagination.size) / pagination.size
    },
    ...mapState('compModule', [
      'compIpcResult',
      'pagination',
      'selfpatentBaseInfo',
      'citepatentBaseInfo'
    ]),
    selfCLMS () {
      let clmsStr = this.selfpatentBaseInfo.CLIMS
      return this._formatCLMS(clmsStr)
    },
    citeCLMS () {
      let clmsStr = this.citepatentBaseInfo.CLIMS
      return this._formatCLMS(clmsStr)
    }
  },
  methods: {
    _formatCLMS (origin) {
      let clmsArr = (origin || '').split('@#'), html = ''
      console.log('!!!!!!!!!!!!!'+ clmsArr.length)
      for (let i = 0, len = clmsArr.length; i < len; i ++) {
        let s = clmsArr[i]
        if (s.trim()){
          html += s + '<br/>'
        }
      }
      let number = html.match(/[0-9]+[.]/g)
      console.log('nmber!!!!!!!!!!!!!'+ number)
      if (number) {
        console.log('not null')
        for(let i = 0, len = number.length; i < len; i++){
          if (i === 0) {
            html = html.replace(number[i], number[i] + '<span style="color: #409EFF;">')
          } else {
            html = html.replace(number[i], '</span>' + number[i] + '<span>')
          }
          html = html.replace(number[i], `<span style="display:inline-block;text-align:center;color:white;margin-right:20px;width:26px;height:26px;background-color:#409EFF">${number[i]}</span>`)
        }
        html += '</span>'
      }
      return html
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
    },
    onSubmit () {
      let ipc = this.form.ipc
      this.$router.push({path: `/comp/ipc/search/${ipc.replace(/\//g, '-')}`})
    },
    clickPagination (curPage) {
      this.patentLoading = true
      this.index=0
      this.activeNames=['1']
      this.searchAnListFormTwo({
        ipc: this.form.ipc.replace(/\//g, '-'),
        size: this.pagination.size,
        start: (curPage - 1) * this.pagination.size
      }).then(() => {
        var an = this.compIpcResult[0].an
        var citedAn = this.compIpcResult[0].citedAn === '' ? '1' : this.compIpcResult[0].citedAn
        this.searchAnDetail({
          an: an,
          citedAn: citedAn
        }).then(() => {
          this.patentLoading = false
        })
      })
    },
    openDetails (row) {
      this.index = row.index
      var an = row.an
      var citedAn = row.citedAn === '' ? '1' : row.citedAn
      this.patentLoading = true
      this.searchAnDetail({
        an: an,
        citedAn: citedAn
      }).then(() => {
        this.patentLoading = false
      })
    },
    prev () {
      if (this.index === 0) {
        alert('已经是第一篇文献了')
        this.message = `已经是第一篇文献了:${+new Date()}`
      } else {
        this.message = ''
        this.patentLoading = true
        this.index = this.index - 1
        var an = this.compIpcResult[this.index].an
        var citedAn = this.compIpcResult[this.index].citedAn === '' ? '1' : this.compIpcResult[this.index].citedAn
        this.searchAnDetail({
          an: an,
          citedAn: citedAn
        }).then(() => {
          this.patentLoading = false
        })
      }
    },
    next () {
      if (this.index === this.compIpcResult.length - 1) {
        alert('已经是最后一篇文献了')
        this.message = `已经是最后一篇文献了:${+new Date()}`
      } else {
        this.message = ''
        this.patentLoading = true
        this.index = this.index + 1
        var an = this.compIpcResult[this.index].an
        var citedAn = this.compIpcResult[this.index].citedAn === '' ? '1' : this.compIpcResult[this.index].citedAn
        this.searchAnDetail({
          an: an,
          citedAn: citedAn
        }).then(() => {
          this.patentLoading = false
        })
      }
    },
    selectHighLight ({row, rowIndex}) {
      if (this.index === rowIndex) {
        return {
          'background-color': 'LightSkyBlue',
          'cursor': 'pointer'
        }
      }
    },
    ...mapActions('compModule', [
      'searchAnList',
      'searchAnListFormTwo',
      'searchAnDetail'
    ])
  },
  components: {
    SearchHeader
  },
  beforeRouteUpdate (to, from, next) {
    let ipc = to.params.ipc
    this.form.ipc = ipc.replace(/-/g, '/')
    this.pageLoading = true
    this.searchAnList(ipc).then(() => {
      cache.cacheIpc(ipc)
      var an = this.compIpcResult[0].an
      var citedAn = this.compIpcResult[0].citedAn === '' ? '1' : this.compIpcResult[0].citedAn
      this.searchAnDetail({
        an: an,
        citedAn: citedAn
      }).then(() => {
      })
      this.pageLoading = false
    })
    next()
  },
  created () {
    let ipc = this.$route.params.ipc
    this.form.ipc = ipc.replace(/-/g, '/')
    this.pageLoading = true
    this.patentLoading = true
    this.searchAnList(ipc).then(() => {
      cache.cacheIpc(ipc)
      var an = this.compIpcResult[0].an
      var citedAn = this.compIpcResult[0].citedAn === '' ? '1' : this.compIpcResult[0].citedAn
      this.searchAnDetail({
        an: an,
        citedAn: citedAn
      }).then(() => {
        this.patentLoading = false
      })
      this.pageLoading = false
    })
  }
}
</script>
<style scoped>
  .page-search .main {
    max-width: 1300px !important;
  }
  .patent-detail {
    padding: 15px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
  .an-list {
    padding: 15px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
  .table-item {
    color:#409EFF;
  }
  .pagination {
    margin-top: 10px;
    margin-left: -15px;
  }
  .prev-next-btn{
    float: right;
  }
  .patent-item label{
    float: left;
    padding-right: 10px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
  }
  .patent-item{
    margin-bottom: 10px;
  }
  .patent-item .content{
    margin-left: 80px;
    line-height: 40px;
    font-size: 14px;
    word-break: break-all;
    word-wrap: break-word;
  }
  .card{
    background-color: white;
    border-radius: 15px;
    border-radius: inherit;
    -moz-box-shadow: inset 0 0 10px #CCC;
    -webkit-box-shadow: inset 0 0 10px #CCC;
    box-shadow: inset 0 0 10px #CCC;
  }
  .card .head{
     background-color: #409EFF;
     text-align: center;
     padding:15px 20px;
     color:white;
  }
  .card .card-main{
    padding:15px 20px;
  }
  .base{
 /*   min-height: 300px;*/
  }
  .card .card-main .baseinfo{
    min-height:280px;
    max-height:350px;
  }
  .el-collapse-item__content .desc-title{
    color:red;
  }

</style>
