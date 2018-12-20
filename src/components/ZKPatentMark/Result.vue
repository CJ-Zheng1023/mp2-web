<script src="../../store/modules/zkPatentMark.js.js"></script>
<template>
  <div class="page page-search" v-loading="pageLoading">
    <search-header :ifSearch=false ></search-header>
    <div class="main">
      <div class="electrical-container" v-loading="pageLoading">
        <el-row :gutter="8">
          <el-col :span="6" v-if="this.zkPatentListResult.length !=0">
            <div class="patent-list">
              <el-row :gutter="10">
                <el-table
                  :data="zkPatentListResult"
                  border
                  style="width: 100%;" @row-click="openDetails" :row-class-name="tableRowClassName" :row-style="selectHighLight"  :header-cell-style="{'background-color': ' #EDEDED','color': '#5E5E5E','text-align':'center'}">
                  <el-table-column prop="Ap" width="155" label="申请号" class="table-item"></el-table-column>
                 <!-- <el-table-column prop="PD" width="150" label="公开日" class="table-item"></el-table-column>-->
                  <el-table-column prop="ipcMain" label="主分类" class="table-item"></el-table-column>
                </el-table>
              </el-row>
              <el-row :gutter="10">
                <el-col>
                  <div class="pagination">
                    <el-pagination
                      @current-change="clickZKPagination"
                      background
                      font-size="12px !important"
                      :current-page="currentPage"
                      layout="prev, pager, next"
                      :page-size="pagination.size"
                      :pager-count="7"
                      :small="true"
                      :total="pagination.total">
                    </el-pagination>
                  </div>
                  <div>案卷总数：{{pagination.total}}</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="6" v-else>
            <el-card class="box-card">
              <p>空空如也~</p>
            </el-card>
          </el-col>
          <el-col :span="18">
            <div class="patent-detail-warp" v-loading="patentLoading">
              <el-row :gutter="5">
                <el-col :span="12" class="mark-title">
                  <div class="portlet">
                    <div class="portlet-body">
                      <div class="">
                        <div class="">
                          <div class="patent-item">
                            <el-alert
                              title="标题和权力要求可以通过鼠标按住Crtl键进行划词"
                              type="warning">
                            </el-alert>
                            <el-alert
                              title="增加或删除标引词一定要点击最下面的‘保存标引词’按钮才会生效"
                              type="warning">
                            </el-alert>
                          </div>
                          <div class="refer">
                            <i class="el-icon-star-off"></i><label>标题拆词参考:</label>
                            <el-button type="primary" plain @click="addMarkTi" size="mini" style="float: right">添加</el-button>
                          </div>
                          <div>
                            <p>
                              <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'success'" class="mark-item"  v-for="item in ZKchaiCiList" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                            </p>
                          </div>
                          <div >标题拆词如下:</div>
                          <div style="min-height: 50px;margin-top:10px;">
                            <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'warning'" @close="closeMark(item)" :closable="true" class="mark-item"  v-for="item in ZKTiWords" :key="item.word + item.type">{{item.word}}</el-tag>
                          </div>
                          <div class="refer">
                            <i class="el-icon-star-off"></i><label>权利要求拆词参考:</label>
                            <el-button type="primary" plain @click="addMarkClms" size="mini" style="float: right">添加</el-button>
                          </div>
                          <div class="marks-scroll marks-height">
                            <div class="marks">
                              <div>
                                <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'success'" class="mark-item"  v-for="item in ClmsChaici" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                              </div>
                            </div>
                          </div>
                          <div class="refer">
                            <i class="el-icon-star-off"></i><label>说明书拆词参考:</label>
                          </div>
                          <div class="marks-scroll marks-height">
                            <div class="marks">
                              <div>
                                <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'success'" class="mark-item"  v-for="item in DescChaici" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                              </div>
                            </div>
                          </div>
                          <div>权利要求和说明书及摘要拆词如下:</div>
                          <div style="min-height: 50px;margin-top:10px;">
                            <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'warning'"  @close="closeMark(item)" :closable="true"  class="mark-item"  v-for="item in clmsWords" :key="item.word + item.type">{{item.word}}</el-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="dialog-footer">
                      <el-button :loading="btnLoading" type="primary" @click="onSubmit" :disabled="saved">保存标引词</el-button>
                    </div>
                    <div>
                      <el-row><el-button-group size="small"  class="prev-next-btn"><el-button type="primary" plain @click="prevZKPatnet" class="prev-patent" icon="el-icon-arrow-left">上一篇</el-button><el-button type="primary" plain  @click="nextZKPatent" class="next-patent">下一篇<i class="el-icon-arrow-right el-icon--right"></i></el-button></el-button-group></el-row>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="patent-detail">
                  <div class="portlet">
                    <div class="portlet-body">
                      <div class="patent-scroll" v-if="currentPatent" style="overflow-x: hidden;height:1000px;">
                        <div class="patent-item">
                          <label>申请号:</label>
                          <div class="content">{{currentPatent.Ap}}</div>
                        </div>
                        <div class="patent-item">
                        <label>发明名称:</label>
                        <div class="content" tabindex='-1' @keyup.18="markWord(1, $event)">{{currentPatent.TI}}</div>
                      </div>
                        <div class="grid-content bg-purple">
                          <el-collapse v-model="activeNames" accordion>
                            <el-collapse-item title="权利要求" name="1">
                              <div  class="content clearfocusoutline" tabindex='-1' @keyup.18="markWord(2, $event)">
                                <div v-html="ZKPatentDetailInfo.CLIMS"></div>
                              </div>
                            </el-collapse-item>
                          </el-collapse>
                        </div>
                        <div class="grid-content bg-purple">
                          <el-collapse v-model="activeNames" accordion>
                            <el-collapse-item title="摘要" name="2">
                              <div  class="content clearfocusoutline" tabindex='-1' @keyup.18="markWord(2, $event)">
                                <div v-html="this.zkPatentListResult[index].AB"></div>
                              </div>
                            </el-collapse-item>
                          </el-collapse>
                        </div>
                        <div class="grid-content bg-purple">
                          <el-collapse v-model="activeNames" accordion>
                            <el-collapse-item title="说明书" name="3">
                              <div  class="content clearfocusoutline" tabindex='-1' @keyup.18="markWord(2, $event)">
                                <div v-html="ZKPatentDetailInfo.DESC"></div>
                              </div>
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
  export default {
    name: 'zkPatentMarkResult',
    data () {
      return {
        patentLoading: false,
        pageLoading: false,
        activeNames: ['1'],
        index: 0,
        message: '',
        btnLoading: false
      }
    },
    computed: {
      ...mapState('zkPatentModule', [
        'zkPatentListResult',
        'pagination',
        'ZKPatentDetailInfo',
        'ZKchaiCiList',
        'ClmsChaici',
        'zkmarkList',
        'DescChaici'
      ]),
      currentPage () {
        let pagination = this.pagination
        return (pagination.start + pagination.size) / pagination.size
      },
      currentPatent () {
        return this.zkPatentListResult[this.index]
      },
      ZKTiWords () {
        let marks = this.zkmarkList
        if (!marks) {
          return []
        }
        return marks.filter(mark => Number(mark.type) === 1)
      },
      clmsWords () {
        let marks = this.zkmarkList
        if (!marks) {
          return []
        }
        return marks.filter(mark => Number(mark.type) === 2)
      },
      saved () {
        let flag = true
        if (!this.zkmarkList) {
          return flag
        }
        for (let i = 0, length = this.zkmarkList.length; i < length; i++) {
          let item = this.zkmarkList[i]
          if (!item.id) {
            flag = false
            break
          }
        }
        return flag
      }
    },
    methods: {
      ...mapActions('zkPatentModule', [
        'searchZKPatent',
        'searchZKPatentDetail',
        'searchZKTiChaiCi',
        'addZKMark',
        'showZKMarkList',
        'searchZKPatentDetailUnion',
        'searchZKPatentFormTwo'
      ]),
      prevZKPatnet () {
        if (this.index === 0) {
          alert('已经是第一篇文献了')
          this.message = `已经是第一篇文献了:${+new Date()}`
        } else {
          this.activeNames=['1']
          this.message = ''
          this.patentLoading = true
          this.index = this.index - 1
         // console.log(this.index)
          var an = this.zkPatentListResult[this.index].Ap
          var title=this.currentPatent.TI
          this.searchZKPatentDetailUnion({an,title}).then(() => {
            this.patentLoading = false
          })
        }
      },
      nextZKPatent () {
        if (this.index === this.zkPatentListResult.length - 1) {
          alert('已经是最后一篇文献了')
          this.message = `已经是最后一篇文献了:${+new Date()}`
        } else {
          this.activeNames=['1']
          this.message = ''
          this.patentLoading = true
          this.index = this.index + 1
          var an = this.zkPatentListResult[this.index].Ap
          var title=this.currentPatent.TI
          this.searchZKPatentDetailUnion({an,title}).then(() => {
            this.patentLoading = false
          })
        }
      },
      openDetails (row) {
        this.index = row.index
        this.activeNames=['1']
        this.patentLoading = true
        var an = row.Ap
        var title=row.TI
        this.searchZKPatentDetailUnion({an,title}).then(() => {
          this.patentLoading = false
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
      clickZKPagination (curPage) {
        console.log(curPage)
        console.log((curPage - 1) * this.pagination.size)
        this.patentLoading = true
        this.index=0
        this.activeNames=['1']
        this.searchZKPatentFormTwo({
          size: this.pagination.size,
          start: (curPage - 1) * this.pagination.size
        }).then(() => {
          var an = this.currentPatent.Ap
          var title=this.currentPatent.TI
          //console.log("title"+ title)
          this.searchZKPatentDetailUnion({an,title}).then(() => {
            this.patentLoading = false
          })
        })
      },
      addMarkTi () {
        let marks = this.zkmarkList
        this.ZKchaiCiList.forEach(mark => {
          let  m = Object.create(null)
          m['type'] = '1'
          m['word'] = mark['word']
          marks.push(m)
        })
        //console.log(marks)
      },
      addMarkClms () {
        let marks = this.zkmarkList
        this.ClmsChaici.forEach(mark => {
          let  m = Object.create(null)
          m['type'] = '2'
          m['word'] = mark['word']
          marks.push(m)
        })
        //console.log(marks)
      },
      onSubmit () {
        this.btnLoading = true
        var ap=this.currentPatent.Ap
        //console.log('ap'+ ap)
        var markList=this.zkmarkList
        let marks = []
        markList.forEach(mark => {
            let  m = Object.create(null)
            m['an'] = ap
            m['type'] = mark['type']
            m['word'] = mark['word']
            marks.push(m)
        })
        this.addZKMark({marks}).then(data => {
          if (data.flag) {
            this.$alert('添加成功', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            }).then(action => {
              this.loading = true
              this.showZKMarkList(ap).then(() => {
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
        let flag = false
        for (let i = 0, len = this.zkmarkList.length; i < len; i++) {
          let item = this.zkmarkList[i]
          if (word + type === item.word + item.type) {
            flag = true
            break
          }
        }
        if (flag) {
          this.$alert(`${word}已添加为标引词`, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          return
        }
        this.zkmarkList.push({
          type,
          word,
          userId: window.localStorage.getItem('userId')
        })
      },
      closeMark (mark) {
        this.zkmarkList.splice(this.zkmarkList.indexOf(mark), 1)
      }
    },
    components: {
      SearchHeader
    },
    beforeRouteUpdate (to, from, next) {
      this.pageLoading = true
      this.searchZKPatent().then(() => {
        var an = this.zkPatentListResult[this.index].Ap
        /*this.searchZKPatentDetail({an}).then(() => {
          var title=this.currentPatent.TI
          this.searchZKTiChaiCi(title).then(() => {
            this.pageLoading = false
          })
        })*/
        var title=this.currentPatent.TI
        console.log("title"+ title)
        this.searchZKPatentDetailUnion({an,title}).then(() => {
          this.pageLoading = false
        })
      })
      next()
    },
    created () {
      this.pageLoading = true
      this.patentLoading = true
      this.searchZKPatent().then(() => {
        this.pageLoading = false
        if(this.zkPatentListResult.length != 0) {
          var an = this.zkPatentListResult[0].Ap
         /* this.searchZKPatentDetail({an}).then(() => {
            var title=this.currentPatent.TI
            this.searchZKTiChaiCi(title).then(() => {
              this.patentLoading = false
              this.pageLoading = false
            })
          })*/
          var title=this.zkPatentListResult[0].TI
          console.log("title"+ title)
          this.searchZKPatentDetailUnion({an,title}).then(() => {
            this.patentLoading = false
            this.pageLoading = false
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
  .marks-height{
    overflow-y: auto;
    max-height: 300px;
    overflow-x: hidden;
  }
  .clearfocusoutline:focus {
    outline: none;
  }
 /* .patent-scroll{
    height: 1000px;
  }*/
</style>
