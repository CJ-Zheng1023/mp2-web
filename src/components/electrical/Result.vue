<script src="../../store/modules/electrical.js"></script>
<template>
  <div class="page page-search" v-loading="pageLoading">
    <search-header :ifSearch=false ></search-header>
    <div class="main">
      <div class="electrical-container" v-loading="pageLoading">
        <el-row :gutter="8">
          <el-col :span="8" v-if="this.patentListResult.length !=0">
            <div class="patent-list">
              <el-row :gutter="10">
                <el-table
                  :data="patentListResult"
                  border
                  style="width: 100%;"  @row-click="openDetails" :row-class-name="tableRowClassName" :row-style="selectHighLight" :header-cell-style="{'background-color': '#409EFF','color': 'white','text-align':'center'}">
                  <el-table-column prop="oldan" width="155" label="申请号" class="table-item"></el-table-column>
                  <el-table-column prop="pn" width="150" label="公开号" class="table-item"></el-table-column>
                  <el-table-column prop="pIpcMain" label="主分类" class="table-item"></el-table-column>
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
          <el-col :span="8" v-else>
            <el-card class="box-card">
              <p>空空如也~</p>
            </el-card>
          </el-col>
          <el-col :span="16">
            <div class="patent-detail-warp" v-loading="patentLoading">
<!--
              <el-row><el-button-group class="prev-next-btn"><el-button type="primary" plain  @click="prev" class="prev-patent" icon="el-icon-arrow-left">上一篇</el-button><el-button type="primary" plain  @click="next" class="next-patent">下一篇<i class="el-icon-arrow-right el-icon&#45;&#45;right"></i></el-button></el-button-group></el-row>
-->
              <el-row :gutter="20">
                <el-col :span="12" class="mark-title">
                  <div class="portlet">
                    <div class="portlet-body">
                      <div class="marks-scroll ">
                        <div class="marks">
                        <!--  <h4>发明名称</h4>-->
                          <div class="patent-item">
                            <el-alert
                              title="标题可以通过鼠标按住Crtl键进行划词"
                              type="warning">
                            </el-alert>
                            <div class="title">
                               <label>发明名称:</label>
                            </div>
                            <div class="content title-content" tabindex='-1' @keyup.18="markWord(1, $event)">{{this.patentInfoDetail.TI}}</div>
                          </div>
                        </div>
                        <div class="refer">
                          <i class="el-icon-star-off"></i><label>标题拆词参考:</label>
                        </div>
                        <div>
                          <p>
                            <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'success'" class="mark-item"  v-for="item in chaiCiList" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                          </p>
                        </div>
                        <div class="refer">
                          <i class="el-icon-star-off"></i><label>检索式编写:</label>
                        </div>
                        <div>
                          <textarea v-if="tiWords.length !== 0" rows="5" cols="40" id="input-title" v-model="tiWords[0].word"></textarea>
                          <!-- <textarea v-else v-model="tiWords[0].word" rows="5" cols="40"></textarea>-->
                          <el-button  size="mini"  type="primary" @click="connectAnd">AND</el-button>
                          <el-button  size="mini"  type="primary" @click="connectOr">OR</el-button>
                          <el-button  size="mini"  type="primary" @click="connectZuokuohao">(</el-button>
                          <el-button  size="mini"  type="primary" @click="connectYoukuohao">)</el-button>
                          <!--<el-button  size="mini"  type="primary" @click="addTitle(1)">添加</el-button>-->
                        </div>
                      </div>
                    </div>
                    <div class="dialog-footer">
                      <el-button :loading="btnLoading" type="primary" @click="onSubmit"  >保存标引词</el-button>
                    </div>
                    <el-row><el-button-group size="small"  class="prev-next-btn"><el-button type="primary" plain  @click="prev" class="prev-patent" icon="el-icon-arrow-left">上一篇</el-button><el-button type="primary" plain  @click="next" class="next-patent">下一篇<i class="el-icon-arrow-right el-icon--right"></i></el-button></el-button-group></el-row>
                  </div>
                </el-col>
                <el-col :span="12" class="patent-detail">
                  <div class="portlet">
                    <div class="portlet-body">
                      <div class="patent-scroll">
                        <div class="patent-item">
                          <label>申请号:</label>
                          <div class="content">{{this.patentInfoDetail.NRD_AN}}</div>
                        </div>
                        <!--<div class="patent-item">
                          <label>发明名称:</label>
                          <div class="content" tabindex='-1' @keyup.18="markWord(1, $event)">{{this.patentInfoDetail.TI}}</div>
                        </div>-->
                        <div class="grid-content bg-purple">
                          <el-collapse v-model="activeNames" accordion>
                            <el-collapse-item title="权利要求" name="3">
                              <div v-html="patentInfoDetail.CLIMS"></div>
                            </el-collapse-item>
                          </el-collapse>
                        </div>
                        <div class="patent-item">
                          <label>发明人:</label>
                          <div class="content" tabindex='-1'>{{this.patentInfoDetail.IN}}</div>
                        </div>
                        <div class="patent-item">
                          <label>申请人:</label>
                          <div class="content" tabindex='-1'>{{this.patentInfoDetail.PA}}</div>
                        </div>
                        <div class="patent-item">
                          <label>国省:</label>
                          <div class="content" tabindex='-1'>{{this.patentInfoDetail.CNAME}}</div>
                        </div>
                        <div class="grid-content bg-purple">
                          <el-collapse v-model="activeNames" accordion>
                            <el-collapse-item title="摘要" name="4">
                              <div v-html="this.patentInfoDetail.AB">
                              </div>
                            </el-collapse-item>
                            <el-collapse-item title="说明书" name="2">
                              <div v-html="patentInfoDetail.DESC">
                              </div>
                            </el-collapse-item>
                            <el-collapse-item title="权利要求" name="6">
                              <div v-html="patentInfoDetail.CLIMS"></div>
                            </el-collapse-item>
                          </el-collapse>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import SearchHeader from '../SearchHeader'
  import { mapState, mapActions } from 'vuex'
  import cache from '../../assets/scripts/cache'
  export default {
    name: 'electricalResult',
    data () {
      return {
        patentLoading: false,
        pageLoading: false,
        activeNames: ['3'],
        index: 0,
        message: '',
        btnLoading: false,
        addTitleed: false,
        content: ''
      }
    },
    computed: {
      ...mapState('electricalModule', [
        'patentListResult',
        'patentInfoDetail',
        'pagination',
        'markTiList',
        'chaiCiList'
      ]),
      currentPage () {
        let pagination = this.pagination
        return (pagination.start + pagination.size) / pagination.size
      },
      showMarks () {
        if (!this.markTiList) {
          return []
        }
        return this.markTiList
      },
      tiWords () {
        let marks = this.showMarks
        if (!marks) {
          return []
        }
        return marks.filter(mark => Number(mark.type) === 1)
      },
      closable () {
          return true
      }
    },
    methods: {
      ...mapActions('electricalModule', [
        'searchPatent',
        'searchPatentDetail',
        'showMarkTiList',
        'addTiMark',
        'deleteTiMark',
        'searchPatentFormTwo',
        'searchPatentDetailAndMark',
        'searchChaiCi'
      ]),
      inputExp (event) {
        this.tiWords[0].word = event.target.value
      },
      connectAnd () {
        let value=this.tiWords[0].word
        let valuenew=value+' and ';
        this.tiWords[0].word=valuenew;
      },
      connectOr () {
        let value=this.tiWords[0].word
        let valuenew=value+' or ';
        this.tiWords[0].word=valuenew;
      },
      connectZuokuohao () {
        let value=this.tiWords[0].word
        let valuenew=value+' ( ';
        this.tiWords[0].word=valuenew;
      },
      connectYoukuohao () {
        let value=this.tiWords[0].word
        let valuenew=value+' ) ';
        this.tiWords[0].word=valuenew;
      },
      clickPagination (curPage) {
        this.patentLoading = true
        this.index=0
        this.activeNames=['3']
            this.searchPatentFormTwo({
              size: this.pagination.size,
              start: (curPage - 1) * this.pagination.size
            }).then(() => {
              var an = this.patentListResult[0].an
              var citedAn = this.patentListResult[0].citedAn
              this.searchPatentDetailAndMark({an,citedAn}).then(() => {
                var title=this.patentInfoDetail.TI
                console.log(title)
                this.searchChaiCi(title).then(() => {
                  this.patentLoading = false
                })
              })
            })
      },
      openDetails (row) {
        this.index = row.index
        this.activeNames=['3']
        var an = row.an
        var citedAn = row.citedAn
        this.patentLoading = true
        this.searchPatentDetailAndMark({an,citedAn}).then(() => {
              var title=this.patentInfoDetail.TI
              this.searchChaiCi(title).then(() => {
                this.patentLoading = false
              })
         })
      },
      tableRowClassName ({row, rowIndex}) {
        row.index = rowIndex
      },
      selectHighLight ({row, rowIndex}) {
        if (this.index === rowIndex) {
          return {
            'background-color': '#d9edf7',
            'cursor': 'pointer'
          }
        }
      },
      onSubmit () {
        this.btnLoading = true
        console.log(this.tiWords)
        if(this.tiWords[0].word == "") {
          alert("没有数据要保存");
          this.btnLoading = false
        }else{
          let marks = []
          this.tiWords.forEach(mark => {
            let  m = Object.create(null)
            m['an'] = this.patentInfoDetail.NRD_AN
            m['citedAn'] = this.patentListResult[this.index].citedAn
            m['userId'] = mark['userId']
            m['type'] = mark['type']
            m['word'] = mark['word']
            marks.push(m)
            /* mark['an'] = this.patentInfoDetail.NRD_AN
            mark['citedAn'] = this.patentListResult[this.index].citedAn */
          })
          this.addTiMark(marks).then(data => {
            if (data.flag) {
              this.$alert('添加成功', '提示', {
                confirmButtonText: '确定',
                type: 'success'
              }).then(action => {
                this.$emit('mark')
                this.loading = true
                var an=this.patentListResult[this.index].an
                var citedAn=this.patentListResult[this.index].citedAn
                console.log(an)
                console.log(citedAn)
                this.showMarkTiList({an,citedAn}).then(() => {
                  this.loading = false
                  this.btnLoading = false
                })
              })
            } else {
              this.$alert('添加失败', '提示', {
                confirmButtonText: '确定',
                type: 'error'
              }).then(action => {
                this.btnLoading = false
              })
            }
          })
        }
      },
      prev () {
        if (this.index === 0) {
          alert('已经是第一篇文献了')
          this.message = `已经是第一篇文献了:${+new Date()}`
        } else {
          this.activeNames=['3']
          this.message = ''
          this.patentLoading = true
          this.index = this.index - 1
          console.log(this.index)
          var an = this.patentListResult[this.index].an
          var citedAn = this.patentListResult[this.index].citedAn
          this.searchPatentDetailAndMark({an,citedAn}).then(() => {
            var title=this.patentInfoDetail.TI
            this.searchChaiCi(title).then(() => {
              this.patentLoading = false
            })
          })
        }
      },
      next () {
        if (this.index === this.patentListResult.length - 1) {
          alert('已经是最后一篇文献了')
          this.message = `已经是最后一篇文献了:${+new Date()}`
        } else {
          this.activeNames=['3']
          this.message = ''
          this.patentLoading = true
          this.index = this.index + 1
          var an = this.patentListResult[this.index].an
          var citedAn = this.patentListResult[this.index].citedAn
          this.searchPatentDetailAndMark({an,citedAn}).then(() => {
            var title=this.patentInfoDetail.TI
            this.searchChaiCi(title).then(() => {
              this.patentLoading = false
            })
          })
        }
      },
      _getSelectText () {
        let text = ''
        if (window.getSelection) {
          text = window.getSelection().toString()
        } else if (document.selection && document.selection.type !== 'Control') {
          text = document.selection.createRange().text
        }
        return text
      },
      markWord (type, event) {
        let word = this._getSelectText()
        this.tiWords[0].word= this.tiWords[0].word+" "+word
      },
      closeMark (mark) {
        if (!mark.id) {
          this.markTiList.splice(this.markTiList.indexOf(mark), 1)
          return
        }
        this.$confirm('此操作将删除该标引词, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.markTiList.splice(this.markTiList.indexOf(mark), 1)
          console.log(this.markTiList)
          this.deleteTiMark(this.markTiList).then((data) => {
            if (data.flag) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              var an=this.patentListResult[this.index].an
              var citedAn=this.patentListResult[this.index].citedAn
              console.log(an)
              console.log(citedAn)
              this.showMarkTiList({an,citedAn}).then(() => {
                if (this.markTiList.length === 0) {
                  this.$emit('unmark')
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    components: {
      SearchHeader
    },
    beforeRouteUpdate (to, from, next) {
      this.pageLoading = true
      this.searchPatent().then(() => {
        var an = this.patentListResult[this.index].an
        var citedAn = this.patentListResult[this.index].citedAn
        this.searchPatentDetailAndMark({an,citedAn}).then(() => {
          var title=this.patentInfoDetail.TI
          this.searchChaiCi(title).then(() => {
            this.pageLoading = false
          })
        })
      })
      next()
    },
    created () {
      this.pageLoading = true
      this.patentLoading = true
      this.searchPatent().then(() => {
        this.pageLoading = false
        if(this.patentListResult.length != 0) {
          var an = this.patentListResult[0].an
          var citedAn = this.patentListResult[0].citedAn
          this.searchPatentDetailAndMark({an,citedAn}).then(() => {
            var title=this.patentInfoDetail.TI
            this.searchChaiCi(title).then(() => {
              this.patentLoading = false
              this.pageLoading = false
            })
          })
        }
      })
    }
  }
</script>
<style scoped>
  .page-search .main {
    max-width: 1340px !important;
  }
  .patent-list{
    padding: 15px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
  .patent-detail-warp{
    padding: 10px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
  .prev-next-btn{
    float: right;
  }
  .portlet{
    background-color: #fff;
    box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.1);
    padding: 12px 20px 15px 20px;
    border-radius: 7px;
  }
  .portlet .portlet-title{
    text-align: right;
  }
  .portlet .portlet-body{
    padding-top: 5px;
  }
  .patent-item label{
    float: left;
    padding-right: 10px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
  }
  .patent-item{
    margin-bottom: 20px;
  }
  .patent-item .content{
    margin-left: 80px;
    line-height: 40px;
    font-size: 14px;
    word-break: break-all;
    word-wrap: break-word;
  }
  .patent-item .content:focus{
    outline: none;
  }
  .mark-item {
    margin-bottom: 5px;
    margin-right: 8px;
  }
  .pagination{
    margin-top:10px;
  }
  .dialog-footer{
    text-align: right;
    margin-top:20px;
    margin-bottom:20px;
  }
  .refer label{
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
  }
  .refer{
     padding-left:20px;
     position: relative;
  }
  .refer i{
    position: absolute;
    left:0;
    top:28%;
  }
  .title-content{
   font-weight: 900;
  }
</style>
