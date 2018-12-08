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
                  style="width: 100%;"  :header-cell-style="{'background-color': '#409EFF','color': 'white','text-align':'center'}">
                  <el-table-column prop="Ap" width="155" label="申请号" class="table-item"></el-table-column>
                 <!-- <el-table-column prop="PD" width="150" label="公开日" class="table-item"></el-table-column>-->
                  <el-table-column prop="ipcMain" label="主分类" class="table-item"></el-table-column>
                </el-table>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
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
              <el-row :gutter="20">
                <el-col :span="12" class="mark-title">
                  <div class="portlet">
                    <div class="portlet-body">
                      <div class="marks-scroll ">
                        <div class="marks">
                          <div class="patent-item">
                            <el-alert
                              title="标题和权力要求可以通过鼠标按住Crtl键进行划词"
                              type="warning">
                            </el-alert>
                          </div>
                          <div class="refer">
                            <i class="el-icon-star-off"></i><label>标题拆词参考:</label>
                          </div>
                          <div>
                            <p>
                              <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'success'" class="mark-item"  v-for="item in ZKchaiCiList" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                            </p>
                          </div>
                          <div>标题拆词</div>
                          <div>1111
                            <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'warning'" class="mark-item"  v-for="item in tiWords" :key="item.word + item.type">{{item.word}}</el-tag>
                          </div>
                          <div class="refer">
                            <i class="el-icon-star-off"></i><label>权利要求拆词参考:</label>
                          </div>
                          <div>
                            <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'success'" class="mark-item"  v-for="item in ClmsChaici" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                          </div>
                          <div>权利要求拆词</div>
                          <div>
                            <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'warning'"  @close="closeMark(item)"  class="mark-item"  v-for="item in clmsWords" :key="item.word + item.type">{{item.word}}</el-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="dialog-footer">
                      <el-button :loading="btnLoading" type="primary" @click="onSubmit" :disabled="saved">保存标引词</el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="patent-detail">
                  <div class="portlet">
                    <div class="portlet-body">
                      <div class="patent-scroll" v-if="currentPatent">
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
                              <div  class="content" tabindex='-1' @keyup.18="markWord(2, $event)">
                                <div v-html="ZKPatentDetailInfo.CLIMS"></div>
                              </div>
                            </el-collapse-item>
                          </el-collapse>
                        </div>
                        <div class="grid-content bg-purple">
                          <el-collapse v-model="activeNames" accordion>
                            <el-collapse-item title="摘要" name="2">
                              <div v-html="this.zkPatentListResult[index].AB"></div>
                            </el-collapse-item>
                          </el-collapse>
                        </div>
                        <div class="grid-content bg-purple">
                          <el-collapse v-model="activeNames" accordion>
                            <el-collapse-item title="说明书" name="3">
                              <div v-html="ZKPatentDetailInfo.DESC"></div>
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
        'zkmarkList'
      ]),
      currentPage () {
        let pagination = this.pagination
        return (pagination.start + pagination.size) / pagination.size
      },
      currentPatent () {
        return this.zkPatentListResult[this.index]
      },
      tiWords () {
        let marks = this.zkmarkList
        if (!marks) {
          return []
        }
        return marks.filter(mark => mark.type === 1)
      },
      clmsWords () {
        let marks = this.zkmarkList
        if (!marks) {
          return []
        }
        return marks.filter(mark => mark.type === 2)
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
        'showZKMarkList'
      ]),
      onSubmit () {
        this.btnLoading = true
        var ap=this.currentPatent.Ap
        console.log('ap'+ ap)
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
        if (!mark.id) {
          this.zkmarkList.splice(this.zkmarkList.indexOf(mark), 1)
          return
        }
        this.$confirm('此操作将删除该标引词, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteZKMark(mark.id).then((data) => {
            if (data.flag) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.showZKMarkList(currentPatent.Ap).then(() => {
                if (this.zkmarkList.length === 0) {
                  alert("没有标引词");
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
      this.searchZKPatent().then(() => {
        var an = this.zkPatentListResult[this.index].Ap
        this.searchZKPatentDetail({an}).then(() => {
          var title=this.currentPatent.TI
          this.searchZKTiChaiCi(title).then(() => {
            this.pageLoading = false
          })
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
          this.searchZKPatentDetail({an}).then(() => {
            var title=this.currentPatent.TI
            this.searchZKTiChaiCi(title).then(() => {
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
