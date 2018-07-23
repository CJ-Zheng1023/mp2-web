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
                <el-button type="primary" @click="random">随 机 <i class="fa fa-random"></i></el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table">
            <el-table :data="addressMarkList" border style="width: 100%">
              <el-table-column prop="an" label="申请号" width="200">
              </el-table-column>
              <el-table-column prop="address" label="地址" width="330">
              </el-table-column>
              <el-table-column prop="zip" label="邮编" width="120">
              </el-table-column>
              <el-table-column label="标引数据" width="380">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.province" placeholder="省/直辖市"></el-input>
                  <el-input v-model="scope.row.city" placeholder="市"></el-input>
                  <el-input v-model="scope.row.area" placeholder="区/县"></el-input>
                  <el-input v-model="scope.row.town" placeholder="镇"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="地图">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="action">
            <el-button type="primary" @click="save">保存标引词</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import SearchHeader from '../SearchHeader'
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      formSearch: {
        keyword: ''
      },
      pageLoading: false
    }
  },
  computed: {
    ...mapState('addressModule', [
      'addressMarkList'
    ])
  },
  methods: {
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
    save () {
      let marks = []
      this.addressMarkList.forEach(item => {
        marks.push({
          marked: item['item'],
          province: item['province'],
          city: item['city'],
          area: item['area'],
          town: item['town'],
          status: item['status']
        })
      })
      this.saveMark(marks).then(data => {
        if (data.flag) {
          alert('success')
        } else {
          alert('error')
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
<style>
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
  .table .el-input{
    display: inline-block;
    width: 80px;
  }
  .action{
    margin-top: 20px;
    text-align: right;
  }
</style>
