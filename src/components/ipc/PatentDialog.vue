<template>
  <div class="patent-dialog-wrapper" v-if="visible">
    <div class="patent-dialog">
      <div class="dialog-header">
        <div class="header-inner">
          <i class="fa fa-compress" @click="closeDialog"></i>
        </div>
      </div>
      <div class="dialog-body" v-loading="loading">
        <div class="actions">
          <span @click="prevPatent" class="prev" tabindex="-1" @keyup.37="prevPatent"><i class="fa fa-arrow-left"></i>上一篇</span>
          <span @click="nextPatent" class="next" tabindex="-1" @keyup.39="nextPatent">下一篇<i class="fa fa-arrow-right"></i></span>
        </div>
        <el-row :gutter="30">
          <el-col :span="10">
            <div class="portlet">
              <div class="portlet-title">
                <el-select size="mini" v-model="filterValue" placeholder="请选择">
                  <el-option
                    v-for="item in filterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="portlet-body">
                <div class="marks-scroll ">
                  <div class="marks">
                    <h4>发明名称</h4>
                    <p>
                      <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'warning'" class="mark-item" @close="closeMark(item)" :closable="closable" v-for="item in tiWords" :key="item.word + item.type">{{item.word}}</el-tag>
                    </p>
                  </div>
                  <div class="marks">
                    <h4>发明人</h4>
                    <p>
                      <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'warning'"  class="mark-item" @close="closeMark(item)" :closable="closable" v-for="item in inWords" :key="item.word + item.type">{{item.word}}</el-tag>
                    </p>
                  </div>
                  <div class="marks">
                    <h4>申请人</h4>
                    <p>
                      <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'warning'"  class="mark-item" @close="closeMark(item)" :closable="closable" v-for="item in paWords" :key="item.word + item.type">{{item.word}}</el-tag>
                    </p>
                  </div>
                  <div class="marks">
                    <h4>国省代码</h4>
                    <p>
                      <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'warning'"  class="mark-item" @close="closeMark(item)" :closable="closable" v-for="item in cnameWords" :key="item.word + item.type">{{item.word}}</el-tag>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="portlet">
              <div class="portlet-body">
                <div class="patent-scroll">
                  <div class="patent-item">
                    <label>申请号:</label>
                    <div class="content">{{patent.NRD_AN}}</div>
                  </div>
                  <div class="patent-item">
                    <label>发明名称:</label>
                    <div class="content" tabindex='-1' @keyup.18="markWord(1, $event)">{{patent.TI}}</div>
                  </div>
                  <div class="patent-item">
                    <label>发明人:</label>
                    <div class="content" tabindex='-1' @keyup.18="markWord(2, $event)">{{patent.IN}}</div>
                  </div>
                  <div class="patent-item">
                    <label>申请人:</label>
                    <div class="content" tabindex='-1' @keyup.18="markWord(3, $event)">{{patent.PA}}</div>
                  </div>
                  <div class="patent-item">
                    <label>国省:</label>
                    <div class="content" tabindex='-1' @keyup.18="markWord(4, $event)">{{patent.CNAME}}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="onSubmit" :disabled="saved" >保存标引词</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    visible: Boolean,
    patent: Object,
    message: String,
    ipc: String
  },
  data () {
    return {
      filterValue: 2,
      loading: false,
      btnLoading: false,
      filterOptions: [
        {
          label: '全部标引',
          value: 1
        },
        {
          label: '自己标引',
          value: 2
        },
        {
          label: '他人标引',
          value: 3
        }
      ]
    }
  },
  computed: {
    ...mapState('ipcModule', [
      'markList'
    ]),
    closable () {
      if (this.filterValue === 1) {
        return false
      } else if (this.filterValue === 2) {
        return true
      } else if (this.filterValue === 3) {
        return false
      }
    },
    saved () {
      let flag = true
      if (!this.markList) {
        return flag
      }
      for (let i = 0, length = this.markList.length; i < length; i++) {
        let item = this.markList[i]
        if (!item.id) {
          flag = false
          break
        }
      }
      return flag
    },
    showMarks () {
      if (!this.markList) {
        return []
      }
      let userId = window.localStorage.getItem('userId')
      let value = this.filterValue
      if (value === 1) {
        return this.markList
      } else if (value === 2) {
        return this.markList.filter(mark => userId === mark.userId)
      } else if (value === 3) {
        return this.markList.filter(mark => userId !== mark.userId)
      }
    },
    tiWords () {
      let marks = this.showMarks
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 1)
    },
    inWords () {
      let marks = this.showMarks
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 2)
    },
    paWords () {
      let marks = this.showMarks
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 3)
    },
    cnameWords () {
      let marks = this.showMarks
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 4)
    }
  },
  methods: {
    onSubmit () {
      this.btnLoading = true
      let marks = this.markList.filter(mark => {
        if (!mark.id) {
          mark['ipc'] = this.ipc
          mark['an'] = this.patent.NRD_AN
        }
        return !mark.id
      })
      this.addMark(marks).then(data => {
        if (data.flag) {
          this.$alert('添加成功', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          }).then(action => {
            this.$emit('mark')
            this.loading = true
            this.showMarkList(this.patent.NRD_AN).then(() => {
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
    closeDialog () {
      if (!this.saved) {
        this.$confirm('您尚有未保存的标引词, 是否离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('close')
          this.filterValue = 2
        }).catch(() => {
        })
      } else {
        this.$emit('close')
        this.filterValue = 2
      }
    },
    closeMark (mark) {
      if (!mark.id) {
        this.markList.splice(this.markList.indexOf(mark), 1)
        return
      }
      this.$confirm('此操作将删除该标引词, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMark(mark.id).then((data) => {
          if (data.flag) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.showMarkList(this.patent.NRD_AN).then(() => {
              this.closable = false
              this.showMarks = this.markList
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
    },
    prevPatent () {
      if (!this.saved) {
        this.$confirm('您尚有未保存的标引词, 是否离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.filterValue = 2
          this.$emit('prev')
        }).catch(() => {
        })
      } else {
        this.filterValue = 2
        this.$emit('prev')
      }
    },
    nextPatent () {
      if (!this.saved) {
        this.$confirm('您尚有未保存的标引词, 是否离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.filterValue = 2
          this.$emit('next')
        }).catch(() => {
        })
      } else {
        this.filterValue = 2
        this.$emit('next')
      }
    },
    markWord (type, event) {
      let word = this._getSelectText()
      let flag = false
      for (let i = 0, len = this.markList.length; i < len; i++) {
        let item = this.markList[i]
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
      this.markList.push({
        type,
        word,
        userId: window.localStorage.getItem('userId')
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
    ...mapActions('ipcModule', [
      'showMarkList',
      'deleteMark',
      'addMark'
    ])
  },
  watch: {
    patent (newValue, oldValue) {
      if (newValue.NRD_AN !== oldValue.NRD_AN) {
        this.loading = true
        this.showMarkList(this.patent.NRD_AN).then(() => {
          this.loading = false
        })
      }
    },
    message (newValue, oldValue) {
      if (newValue) {
        this.$message({
          type: 'warning',
          message: `${newValue}`.split(':')[0]
        })
      }
    }
  },
  created () {
    document.querySelector('body').addEventListener('keyup', (event) => {
      if (!this.visible) {
        return
      }
      if (event.keyCode === 37) {
        this.prevPatent()
      } else if (event.keyCode === 39) {
        this.nextPatent()
      }
    })
  }
}
</script>
<style>
  .patent-dialog{

    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  .dialog-header{
    padding: 20px 20px 10px 20px;
  }
  .dialog-header .header-inner{
    text-align: right;
  }
  .header-inner i{
    font-size: 14px;
    color: #a0a0a0;
    cursor: pointer;
  }
  .dialog-body{
    padding: 15px 20px 30px 20px;
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
  .marks h4{
    color: #0366d6;
    font-size: 16px;
    margin: 10px 0 5px 0;
  }
  .marks p{
    margin: 0;
    min-height: 30px;
  }
  .mark-item{
    margin-bottom: 5px;
    margin-right: 8px;
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
  .dialog-footer{
    padding: 10px 20px 20px 20px;
    text-align: right;
  }
  .actions{
    overflow: hidden;
    margin-bottom: 15px;
  }
  .actions .prev{
    float: left;
    cursor: pointer;
    font-size: 14px;
    color: #0366d6;
  }
  .actions .next{
    float: right;
    cursor: pointer;
    font-size: 14px;
    color: #0366d6;
  }
  .marks-scroll{
    height: 400px;
    overflow-y: auto;
  }
  .patent-scroll{
    height: 428px;
    overflow-y: auto;
  }
</style>
