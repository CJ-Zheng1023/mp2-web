<template>
  <el-dialog @open="openDialog" title="标引规则查询" :visible="dialogVisible" width="800px" :before-close="handleClose">
    <el-dialog @close="closeUpdateDialog('updateForm')" width="450px" title="修改标引规则" :visible.sync="updateDialogVisible" append-to-body>
      <el-form :model="addressRule" label-width="100px" ref="updateForm" :rules="rules">
        <el-form-item label="标引地址">
          <span>{{ addressRule.address }}</span>
        </el-form-item>
        <el-form-item label="标引规则" prop="rule">
          <el-input v-model="addressRule.rule" placeholder="标引规则"></el-input>
        </el-form-item>
        <el-form-item label="省/直辖市" prop="province">
          <el-input v-model="addressRule.province" placeholder="省/直辖市"></el-input>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="addressRule.city" placeholder="市"></el-input>
        </el-form-item>
        <el-form-item label="区/县" prop="area">
          <el-input v-model="addressRule.area" placeholder="区/县"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate('updateForm')" :loading="updateBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-form :inline="true" :model="ruleForm" class="rule-form">
      <el-form-item label="标引规则">
        <el-input v-model="ruleForm.keyword" placeholder="标引规则"></el-input>
      </el-form-item>
      <el-form-item label="查看范围">
        <el-select v-model="ruleForm.type" placeholder="查看范围">
          <el-option label="查看全部" value="1"></el-option>
          <el-option label="查看自己" value="2"></el-option>
          <el-option label="查看别人" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="pageLoading">
      <div v-if="addressRuleListByPage.length !== 0">
        <el-table :data="addressRuleListByPage" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="地址" class="item-address">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item label="省">
                  <span>{{ props.row.province }}</span>
                </el-form-item>
                <el-form-item label="市">
                  <span>{{ props.row.city }}</span>
                </el-form-item>
                <el-form-item label="区">
                  <span>{{ props.row.area }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="用户名" prop="user.username" width="160">
          </el-table-column>
          <el-table-column label="标引规则" prop="rule" width="400">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="curUserId === scope.row.userId"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            background
            @current-change="clickPagination"
            layout="prev, pager, next"
            :total="pagination.total"
            :page-size="pagination.size"
            :current-page="pageNumber">
          </el-pagination>
        </div>
      </div>
      <p v-else style="text-align: center;">
        暂无数据
      </p>
    </div>
  </el-dialog>
</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  props: {
    dialogVisible: Boolean
  },
  data () {
    return {
      ruleForm: {
        keyword: '',
        type: '1'
      },
      addressRule: {
        rule: '',
        province: '',
        city: '',
        area: ''
      },
      rules: {
        rule: [
          { required: true, message: '请输入标引规则', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请输入省/直辖市', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入市', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入区/县', trigger: 'blur' }
        ]
      },
      size: 10,
      pageLoading: false,
      curUserId: window.localStorage.getItem('userId'),
      updateDialogVisible: false,
      updateBtnLoading: false
    }
  },
  computed: {
    ...mapState('addressModule', [
      'addressRuleListByPage',
      'pagination'
    ]),
    pageNumber () {
      return this.pagination.pageNumber + 1
    }
  },
  methods: {
    ...mapActions('addressModule', [
      'queryRuleByPage',
      'updateAddressRule'
    ]),
    closeUpdateDialog (formName) {
      this.$refs[formName].clearValidate()
    },
    handleUpdate (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateBtnLoading = true
          this.updateAddressRule(this.addressRule).then(data => {
            this.updateBtnLoading = false
            if (data.flag) {
              this.$alert('修改成功', '提示', {
                confirmButtonText: '确定',
                type: 'success'
              }).then(action => {
                this.onSubmit()
                this.$emit('refresh-rule')
                this.updateDialogVisible = false
              })
            } else {
              this.updateBtnLoading = false
              this.$alert('修改失败', '提示', {
                confirmButtonText: '确定',
                type: 'error'
              }).then(action => {
                this.updateDialogVisible = false
              })
            }
          }).catch(e => {
            this.$alert('修改失败', '提示', {
              confirmButtonText: '确定',
              type: 'error'
            }).then(action => {
              this.updateDialogVisible = false
            })
          })
        } else {
          return false
        }
      })
    },
    clickPagination (curPage) {
      this.pageLoading = true
      this.queryRuleByPage({
        keyword: this.ruleForm.keyword,
        type: this.ruleForm.type,
        pageNumber: curPage - 1,
        size: this.size
      }).then(() => {
        this.pageLoading = false
      })
    },
    handleEdit (index, row) {
      this.addressRule = {
        id: row['id'],
        province: row['province'],
        city: row['city'],
        area: row['area'],
        address: row['address'],
        rule: row['rule']
      }
      this.updateDialogVisible = true
    },
    handleClose (done) {
      this.$emit('close')
    },
    onSubmit () {
      this.pageLoading = true
      this.queryRuleByPage({
        keyword: this.ruleForm.keyword,
        type: this.ruleForm.type,
        pageNumber: 0,
        size: this.size
      }).then(() => {
        this.pageLoading = false
      })
    },
    openDialog () {
      this.onSubmit()
    }
  }
}
</script>
<style scoped>
  .rule-form{
    text-align: center;
  }
  .table-expand {
    font-size: 0;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .table-expand .el-form-item.item-address {
    width: 100%;
  }
  .pagination-wrapper {
    margin-top: 15px;
    text-align: center;
  }
</style>
