<template>
  <div class="page page-search" v-loading="pageLoading">
    <search-header :ifSearch=false ></search-header>
    <div class="main">
      <div class="address-container">
        <el-card>
          <div class="search">
            <el-form :inline="true" :model="formSearch" class="demo-form-inline">
              <el-form-item label="关键词">
                <el-input v-model="formSearch.keyword" placeholder="请输入关键词"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="random">查 询 <i class="fa fa-random"></i></el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table">
            <el-table :data="addressMarkList" border style="width: 100%">
              <el-table-column prop="an" label="申请号" width="180">
              </el-table-column>
              <el-table-column prop="address" label="地址" width="330">
              </el-table-column>
              <el-table-column prop="zip" label="邮编" width="120">
              </el-table-column>
              <el-table-column label="标引数据" width="400">
                <template slot-scope="scope">
                  <div class="input-item input-item-icon">
                    <input v-model="scope.row.province" @blur="checkProvince(scope.row, $event)" placeholder="省/直辖市"/>
                    <i v-if="scope.row.status === 1" class="fa fa-check success"></i>
                    <i v-else-if="scope.row.status === 0" class="fa fa-exclamation warning"></i>
                  </div>
                  <div class="input-item">
                    <input v-model="scope.row.city" placeholder="市" />
                  </div>
                  <div class="input-item">
                    <input v-model="scope.row.area" placeholder="区/县"/>
                  </div>
                  <div class="input-item">
                    <input v-model="scope.row.town" placeholder="镇"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="地图">
                <template slot-scope="scope">
                  <a target="_blank" :href="scope.row.url">查看</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="action">
            <el-button type="primary" @click="save" :loading="saveBtnLoading">保存标引词</el-button>
            <el-button type="success" @click="openDialog">批量标引</el-button>
          </div>
        </el-card>
        <el-dialog title="批量标引" :visible.sync="dialogVisible" @close="closeDialog">
          <div class="dialog-body">
            <div class="input-item input-item-icon validate" :class="{'error': mark.province.isError}">
              <input v-model="mark.province.value" @blur="validate(mark, 'province', $event)" placeholder="省/直辖市"/>
              <i v-if="mark.status === 1" class="fa fa-check success"></i>
              <i v-else-if="mark.status === 0" class="fa fa-exclamation warning"></i>
            </div>
            <div class="input-item validate" :class="{'error': mark.city.isError}">
              <input v-model="mark.city.value" @blur="validate(mark, 'city', $event)" placeholder="市" />
            </div>
            <div class="input-item">
              <input v-model="mark.area" placeholder="区/县"/>
            </div>
            <div class="input-item">
              <input v-model="mark.town" placeholder="镇"/>
            </div>
          </div>
          <p class="error-message-area" :class="{'show-error-message': showErrorMessage}">
            省/直辖市、市为必填项
          </p>
          <div slot="footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="batch" :loading="batchBtnLoading">批量保存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import SearchHeader from '../SearchHeader'
import province from '../../assets/scripts/province'
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      formSearch: {
        keyword: ''
      },
      pageLoading: false,
      dialogVisible: false,
      batchBtnLoading: false,
      saveBtnLoading: false,
      mark: {
        province: {
          value: '',
          isError: false
        },
        city: {
          value: '',
          isError: false
        },
        area: '',
        town: '',
        status: ''
      }
    }
  },
  computed: {
    ...mapState('addressModule', [
      'addressMarkList'
    ]),
    showErrorMessage () {
      let mark = this.mark
      return mark.province.isError || mark.city.isError
    }
  },
  methods: {
    _clearMark () {
      this.mark = {
        province: {
          value: '',
          isError: false
        },
        city: {
          value: '',
          isError: false
        },
        area: '',
        town: '',
        status: ''
      }
    },
    openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this._clearMark()
      this.dialogVisible = false
    },
    validate (data, key, event) {
      let target = event.target || event.srcElement
      let value = target.value
      if (!value) {
        data.status = ''
        data[key]['isError'] = true
        return
      }
      data[key]['isError'] = false
      if (key !== 'province') {
        return
      }
      if (province.check(value)) {
        data.status = 1
      } else {
        data.status = 0
      }
    },
    checkProvince (data, event) {
      let target = event.target || event.srcElement
      let value = target.value
      if (!value) {
        data.status = ''
        return
      }
      if (province.check(value)) {
        data.status = 1
      } else {
        data.status = 0
      }
    },
    ...mapActions('addressModule', [
      'showMarking',
      'search',
      'saveMark'
    ]),
    random () {
      this.pageLoading = true
      this.search(this.formSearch.keyword).then(() => {
        this.pageLoading = false
      })
    },
    handleClick () {},
    batch () {
      let marks = []
      let mark = this.mark
      if (!mark.province.value) {
        mark.province.isError = true
      }
      if (!mark.city.value) {
        mark.city.isError = true
      }
      if (this.showErrorMessage) {
        return
      }
      this.addressMarkList.forEach(item => {
        marks.push({
          id: item['id'],
          marked: '1',
          province: mark['province'].value,
          city: mark['city'].value,
          area: mark['area'],
          town: mark['town'],
          status: mark['status']
        })
      })
      this.batchBtnLoading = true
      this.saveMark(marks).then(data => {
        if (data.flag) {
          this.$alert('添加成功', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          }).then(action => {
            this.random()
            this._clearMark()
            this.batchBtnLoading = false
          })
        } else {
          this.$alert('添加失败', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(action => {
            this.batchBtnLoading = false
          })
        }
      })
    },
    save () {
      let marks = []
      this.addressMarkList.forEach(item => {
        marks.push({
          id: item['id'],
          marked: (item['province'] && item['city']) ? '1' : '',
          province: item['province'],
          city: item['city'],
          area: item['area'],
          town: item['town'],
          status: item['status']
        })
      })
      this.saveBtnLoading = true
      this.saveMark(marks).then(data => {
        if (data.flag) {
          this.$alert('添加成功', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          }).then(action => {
            this.random()
            this.saveBtnLoading = false
          })
        } else {
          this.$alert('添加失败', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(action => {
            this.saveBtnLoading = false
          })
        }
      })
    }
  },
  components: {
    SearchHeader
  },
  created () {
    this.pageLoading = true
    this.showMarking().then(() => {
      this.pageLoading = false
    })
  }
}
</script>
<style scoped>
  .address-container{
    padding: 15px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
  .search{
    text-align: center;
  }
  .search .el-input{
    width: 300px;
  }
  .input-item{
    display: inline-block;
    position: relative;
  }
  .input-item input{
    width: 80px;
    padding: 0 10px 0 10px;
    line-height: 40px;
    box-sizing: border-box;
    margin: 0;
    border-radius: 4px;
    height: 40px;
    border: 1px solid rgb(220, 223, 230);
    color: #606266;
    size: 14px;
  }
  .input-item input:hover{
    border-color: #c0c4cc;
  }
  .input-item input:focus{
    border-color: #409EFF;
    outline: 0;
  }
  .input-item.validate.error input{
    border-color: #F56C6C;
  }
  .input-item.validate.error input:hover, .input-item.validate.error input:focus{
    border-color: #F56C6C;
  }
  .error-message-area{
    display: none;
    margin-left: 140px;
  }
  .show-error-message{
    color: #F56C6C;
    display: block;
  }
  input::-webkit-input-placeholder{
    color: #C9C1C1;
    text-align: center;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color: #C9C1C1;
    text-align: center;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color: #C9C1C1;
    text-align: center;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color: #C9C1C1;
    text-align: center;
  }
  .input-item.input-item-icon input{
    width: 110px;
    padding-right: 25px;
  }
  .input-item.input-item-icon>i{
    position: absolute;
    right: 8px;
    line-height: 40px;
    top: 0;
  }
  .input-item.input-item-icon>i.success{
    color: #67C23A;
  }
  .input-item.input-item-icon>i.warning{
    color: #E6A23C;
  }
  .action{
    margin-top: 20px;
    text-align: right;
  }
  .dialog-body{
    text-align: center;
  }
</style>
