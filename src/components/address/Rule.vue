<template>
  <el-dialog @open="openDialog" title="标引规则查询" :visible="dialogVisible" width="800px" :before-close="handleClose">
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
          <el-table-column label="用户名" prop="user.username">
          </el-table-column>
          <el-table-column label="标引规则" prop="rule">
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
            :current-page.sync="pagination.pageNumber + 1">
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
      size: 10,
      pageLoading: false,
      curUserId: window.localStorage.getItem('userId')
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
      'queryRuleByPage'
    ]),
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
      console.log(row)
    },
    handleClose (done) {
      this.$emit('close')
    },
    onSubmit () {
      console.log(123)
    },
    openDialog () {
      this.pageLoading = true
      this.queryRuleByPage({
        keyword: this.ruleForm.keyword,
        type: this.ruleForm.type,
        pageNumber: 0,
        size: this.size
      }).then(() => {
        this.pageLoading = false
      })
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
