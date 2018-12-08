<script src="../../store/modules/patent.js"></script>
<template>
  <div class="page page-search" v-loading="pageLoading">
    <search-header :ifSearch=false>
    </search-header>
    <div class="main">
      <el-row :gutter="8">
        <el-col :span="7" v-if="compResult.length !=0">
          <div class="an-list">
            <el-row :gutter="10">
              <el-table
                :data="compResult"
                border
                style="width: 100%;" @row-click="openDetails" :row-class-name="tableRowClassName" :row-style="selectHighLight" :header-cell-style="{'background-color': '#FFCA28','color': 'black','text-align':'center'}" >
                <el-table-column prop="apoldAn" label="申请号" width="160" class="table-item"></el-table-column>
                <el-table-column  label="对比文献">
                  <el-table-column prop="citedAn" label="申请号" width="160" class="table-item"></el-table-column>
                  <el-table-column prop="citeType" label="类型" width="153" class="table-item"></el-table-column>
              <!--    <el-table-column prop="location" label="排名" width="61" class="table-item"></el-table-column>-->
                </el-table-column>
              </el-table>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <div class="pagination">
                  <el-pagination
                    @current-change="clickPagination"
                    background
                    font-size="12px !important"
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
        <el-col :span="7" v-else>
          <el-card class="box-card">
            <p>空空如也~</p>
          </el-card>
        </el-col>
        <el-col :span="17" v-if="compResult.length !=0">
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
                            <div class="content"  v-if="this.compResult[this.index]">{{this.compResult[this.index].apIpc}}</div>
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
                          <el-collapse-item title="权利要求" name="3">
                            <div v-html="selfpatentBaseInfo.CLIMS"></div>
                          </el-collapse-item>
                          <el-collapse-item title="摘要" name="4">
                            <div v-html="this.selfpatentBaseInfo.AB">
                            </div>
                          </el-collapse-item>
                          <el-collapse-item title="说明书" name="2">
                            <div v-html="selfpatentBaseInfo.DESC">
                            </div>
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
                            <div class="content">{{this.compResult[this.index].cIpc}}</div>
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
                          <el-collapse-item title="发明名称" name="1" class="collapse-title">
                            <div v-html="this.citepatentBaseInfo.TI"></div>
                          </el-collapse-item>
                          <el-collapse-item title="权利要求" name="3">
                            <div v-html="this.citepatentBaseInfo.CLIMS"></div>
                          </el-collapse-item>
                          <el-collapse-item title="摘要" name="4">
                            <div v-html="this.citepatentBaseInfo.AB">
                            </div>
                          </el-collapse-item>
                          <el-collapse-item title="说明书" name="2">
                            <div v-html="this.citepatentBaseInfo.DESC"></div>
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
        <el-col :span="17" v-else>
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
import { mapState, mapActions } from 'vuex'
import cache from '../../assets/scripts/cache'
export default {
  name: 'patentResult',
  data () {
    return {
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
    ...mapState('patentModule', [
      'compResult',
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
      let html = origin || ''
      let number = html.match(/[0-9]+[.]/g)
      if (number) {
        for(let i = 0, len = number.length; i < len; i++){
          if (i === 0) {
            html = html.replace(number[i], number[i] + '<span style="color: #409EFF;">')
          } else {
            html = html.replace(number[i], '</span>' + number[i] + '<span>')
          }
          html = html.replace(number[i], `<span style="color:blue;font-size: 18px;">${number[i]}</span>`)
        }
        html += '</span>'
      }
      return html
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
    },
    clickPagination (curPage) {
      this.patentLoading = true
      this.index=0
      this.activeNames=['1']
      this.searchPatentListFormTwo({
        size: this.pagination.size,
        start: (curPage - 1) * this.pagination.size
      }).then(() => {
        var an = this.compResult[0].an
        var citedAn = this.compResult[0].citedAn === '' ? '1' : this.compResult[0].citedAn
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
      this.activeNames=['1']
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
        this.activeNames=['1']
        this.message = ''
        this.patentLoading = true
        this.index = this.index - 1
        var an = this.compResult[this.index].an
        var citedAn = this.compResult[this.index].citedAn === '' ? '1' : this.compResult[this.index].citedAn
        this.searchAnDetail({
          an: an,
          citedAn: citedAn
        }).then(() => {
          this.patentLoading = false
        })
      }
    },
    next () {
      if (this.index === this.compResult.length - 1) {
        alert('已经是最后一篇文献了')
        this.message = `已经是最后一篇文献了:${+new Date()}`
      } else {
        this.activeNames=['1']
        this.message = ''
        this.patentLoading = true
        this.index = this.index + 1
        var an = this.compResult[this.index].an
        var citedAn = this.compResult[this.index].citedAn === '' ? '1' : this.compResult[this.index].citedAn
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
          'background-color': '#d9edf7',
          'cursor': 'pointer'
        }
      }
    },
    ...mapActions('patentModule', [
      'searchPatentsList',
      'searchPatentListFormTwo',
      'searchAnDetail'
    ])
  },
  components: {
    SearchHeader
  },
  beforeRouteUpdate (to, from, next) {
    this.pageLoading = true
    this.searchPatentsList().then(() => {
      var an = this.compResult[0].an
      var citedAn = this.compResult[0].citedAn === '' ? '1' : this.compResult[0].citedAn
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
    this.pageLoading = true
    this.patentLoading = true
    this.searchPatentsList().then(() => {
      this.pageLoading = false
      if(this.compResult.length != 0) {
        var an = this.compResult[0].an
        var citedAn = this.compResult[0].citedAn === '' ? '1' : this.compResult[0].citedAn
        this.searchAnDetail({
          an: an,
          citedAn: citedAn
        }).then(() => {

        })
      }
      this.patentLoading = false
    })
  }
}
</script>
<style scoped>
  .page {
    background-image: url('../../assets/images/bg1.jpg')!important;
    background-attachment: fixed;
    background-size: cover;
  }
  .page-search .main {
    max-width: 1340px !important;
  }
  .patent-detail {
    padding: 10px;
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
     background-color: #FFCA28;
     text-align: center;
     padding:15px 20px;
     color:black;
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
 /* .card .card-main .baseinfo{
    min-height:100px;
  }*/
  .el-collapse-item__header {
    font-size: 14px;
    font-weight: 600;
  }

</style>
