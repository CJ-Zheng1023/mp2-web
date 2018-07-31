<template>
  <div class="page page-search">
    <search-header :ifSearch=false ></search-header>
    <div class="main">
      <div class="address-container" v-loading="pageLoading">
        <el-card>
          <div class="search">
            <el-form :inline="true" :model="formSearch" class="demo-form-inline">
              <el-form-item label="地址">
                <el-input v-model="formSearch.keyword" placeholder="请输入地址"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="clickSearchBtn">查 询 <i class="fa fa-search"></i></el-button>
                <el-button type="success" @click="openDialog">批量标引 <i class="fa fa-bookmark"></i></el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table">
            <el-table :data="addressMarkList" border style="width: 100%" @selection-change="handleSelectionChange" ref="multipleTable">
              <el-table-column type="selection" width="35">
              </el-table-column>
              <el-table-column prop="an" label="申请号" width="160">
              </el-table-column>
              <el-table-column prop="appName" label="申请人" width="160">
              </el-table-column>
              <el-table-column label="地址" width="280">
                <template slot-scope="scope">
                  <a target="_blank" :href="scope.row.url">{{scope.row.address}}</a>
                </template>
              </el-table-column>
              <el-table-column label="邮编" width="75">
                <template slot-scope="scope">
                  <el-popover
                    placement="top"
                    :title="scope.row.popoverTitle"
                    trigger="hover"
                    :content="scope.row.zip">
                    <a href="javascript:;" class="zip-content" slot="reference">{{scope.row.zip}}</a>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="标引数据" width="320">
                <template slot-scope="scope">
                  <div class="input-item input-item-icon">
                    <input v-model="scope.row.province" @blur="checkProvince(scope.row, $event)" placeholder="省/直辖市"/>
                    <i v-if="scope.row.status === 1" class="fa fa-check success"></i>
                    <i v-else-if="scope.row.status === 2" class="fa fa-exclamation warning"></i>
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
              <el-table-column label="标引规则">
                <template slot-scope="scope">
                  <div class="input-item input-item-rule">
                    <input v-model="scope.row.rule" placeholder="标引规则"/>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="action">
            <el-button type="primary" @click="save" :loading="saveBtnLoading" :disabled="saved">保存标引词</el-button>
          </div>
        </el-card>
        <el-dialog title="批量标引" :visible.sync="dialogVisible" @close="closeDialog">
          <div class="dialog-body">
            <div class="input-item input-item-icon">
              <input v-model="mark.province" @blur="checkProvince(mark, $event)" placeholder="省/直辖市"/>
              <i v-if="mark.status === 1" class="fa fa-check success"></i>
              <i v-else-if="mark.status === 2" class="fa fa-exclamation warning"></i>
            </div>
            <div class="input-item">
              <input v-model="mark.city" placeholder="市" />
            </div>
            <div class="input-item">
              <input v-model="mark.area" placeholder="区/县"/>
            </div>
            <div class="input-item">
              <input v-model="mark.town" placeholder="镇"/>
            </div>
          </div>
          <div slot="footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="batch">确定</el-button>
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
      saveBtnLoading: false,
      mark: {
        province: '',
        city: '',
        area: '',
        town: '',
        status: 0,
        marked: ''
      },
      multipleSelection: []
    }
  },
  computed: {
    ...mapState('addressModule', [
      'addressMarkList'
    ]),
    saved () {
      let flag = true
      for (let i = 0, len = this.addressMarkList.length; i < len; i++) {
        let item = this.addressMarkList[i]
        if (item['province'] && item['city']) {
          flag = false
          break
        }
      }
      return flag
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    _checkMarked (data) {
      if (data['province'] && data['city']) {
        data['marked'] = '1'
      } else if (!data['province'] && !data['city']) {
        data['marked'] = ''
      } else {
        data['marked'] = '2'
      }
    },
    input (row, key, event) {
      row[key] = event.target.value
      this._checkMarked(row)
    },
    mouseoverZip (row) {
      if (row.popoverContent) {
        return
      }
      this.showAddressByZip(row.zip).then(data => {
        let resBody = data['showapi_res_body']
        row.popoverTitle = '查询结果'
        row.popoverContent = resBody['address'] || '地址查询失败'
      }).catch(e => {
        row.popoverTitle = '查询结果'
        row.popoverContent = '地址查询失败'
      })
    },
    clickSearchBtn () {
      if (!this.saved) {
        this.$confirm('您尚有未保存的标引词, 是否放弃保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.random()
        }).catch(() => {
        })
      } else {
        this.random()
      }
    },
    _clearMark () {
      this.mark = {
        province: '',
        city: '',
        area: '',
        town: '',
        status: 0,
        marked: ''
      }
    },
    openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this._clearMark()
      this.dialogVisible = false
    },
    checkProvince (data, event) {
      let target = event.target || event.srcElement
      let value = target.value
      if (!value) {
        data.status = 0
        return
      }
      if (province.check(value)) {
        data.status = 1
      } else {
        data.status = 2
      }
    },
    ...mapActions('addressModule', [
      'showMarking',
      'search',
      'saveMark',
      'showAddressByZip'
    ]),
    random () {
      this.pageLoading = true
      this.search(this.formSearch.keyword).then(() => {
        this.pageLoading = false
      }).catch(e => {
        this.$alert('查询超时', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        }).then(action => {
          this.pageLoading = false
        })
      })
    },
    batch () {
      let mark = this.mark
      this._checkMarked(mark)
      this.multipleSelection.forEach(item => {
        item['province'] = mark['province']
        item['city'] = mark['city']
        item['area'] = mark['area']
        item['town'] = mark['town']
        item['status'] = mark['status']
        item['marked'] = mark['marked']
      })
      this.dialogVisible = false
    },
    save () {
      let marks = []
      let rules = []
      this.addressMarkList.forEach(item => {
        marks.push({
          id: item['id'],
          marked: (item['province'] && item['city']) ? '1' : '',
          province: item['province'].trim(),
          city: item['city'].trim(),
          area: item['area'].trim(),
          town: item['town'].trim(),
          status: item['status'],
          address: item['address']
        })
        let rule = item['rule']
        let province = item['province']
        let city = item['city']
        if (rule && province && city) {
          rules.push({
            province: province.trim(),
            city: city.trim(),
            area: item['area'].trim(),
            rule: item['rule']
          })
        }
      })
      this.saveBtnLoading = true
      this.saveMark({marks, rules}).then(data => {
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
      }).catch(e => {
        this.saveBtnLoading = false
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
    }).catch(e => {
      this.$alert('查询超时', '提示', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(action => {
        this.pageLoading = false
      })
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
    width: 60px;
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
    width: 100px;
    padding-right: 25px;
  }
  .input-item.input-item-rule input{
    width: 120px;
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
  .zip-content{
    text-decoration: none;
    color: #606266;
  }
</style>
