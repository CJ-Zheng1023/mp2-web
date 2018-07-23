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
            <el-table :data="addressMarkFormList" border style="width: 100%">
              <el-table-column prop="an" label="申请号" width="200">
              </el-table-column>
              <el-table-column prop="address" label="地址" width="330">
              </el-table-column>
              <el-table-column prop="zip" label="邮编" width="120">
              </el-table-column>
              <el-table-column label="标引数据" width="380">
                <template slot-scope="scope">
                  <el-input v-model="province" placeholder="省/直辖市"></el-input>
                  <el-input v-model="city" placeholder="市"></el-input>
                  <el-input v-model="area" placeholder="区/县"></el-input>
                  <el-input v-model="town" placeholder="镇"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="地图">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
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
    ]),
    addressMarkFormList () {
      // let arr = []
      this.addressMarkList.forEach(item => {
        /* let newItem = {
          id: item.id,
          an: item.an,
          address: item.address,
          zip: item.zip
        }
        arr.push(newItem) */
        this.$set(item, 'marked', '')
        this.$set(item, 'province', '')
        this.$set(item, 'city', '')
        this.$set(item, 'area', '')
        this.$set(item, 'town', '')
        this.$set(item, 'status', 1)
      })
      return this.addressMarkList
    }
  },
  methods: {
    ...mapActions('addressModule', [
      'showMarking',
      'search'
    ]),
    random () {
      this.pageLoading = true
      this.search(this.formSearch.keyword).then(() => {
        this.pageLoading = false
      })
    },
    handleClick () {}
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
  .table .el-input{
    display: inline-block;
    width: 80px;
  }
</style>
