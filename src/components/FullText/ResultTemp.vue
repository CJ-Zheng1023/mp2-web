<script src="../../store/modules/fulltext.js"></script>
<template>
  <div class="page page-search" v-loading="pageLoading">
    <search-header :ifSearch=false>
    </search-header>
    <div class="main">
      <el-row :gutter="24">
         <el-col :span="5"  v-if="fullTextList.length !=0">
           <div class="an-list">
             <el-row :gutter="24">
               <el-table
                 :data="fullTextList"
                 border
                 style="width: 100%;" @row-click="openDetails" :row-class-name="tableRowClassName" :row-style="selectHighLight" :header-cell-style="{'background-color': '#007fff','color': 'white','text-align':'center','opacity': '0.7'}" >
                 <el-table-column prop="ap" label="申请号"  class="table-item"></el-table-column>
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
                     layout="prev, next, jumper"
                     :page-size="pagination.size"
                     :total="pagination.total">
                   </el-pagination>
                 </div>
               </el-col>
             </el-row>
             <el-row :gutter="24">
             </el-row>
           </div>
         </el-col>
         <el-col :span="5" v-else>
          <el-card class="box-card">
            <p>空空如也~</p>
          </el-card>
         </el-col>
         <el-col :span="19" v-if="fullTextList.length !=0">
            <div class="fulltext">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix card_head">
                  <span>独权</span>
                </div>
                <div >
                 {{this.clms}}
                </div>
              </el-card>
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix card_head">
                  <span>背景技术最后一段落</span>
                </div>
                <div >
                  {{this.background}}
                </div>
              </el-card>
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix clearfix card_head">
                  <span>说明书第一段落</span>
                </div>
                <div >
                  {{this.desc}}
                </div>
              </el-card>
            </div>
         </el-col>
         <el-col :span="19" v-else>
          <el-card class="box-card">
            <p>空空如也~</p>
          </el-card>
         </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import SearchHeader from '../SearchHeader'
  import { mapState, mapActions } from 'vuex'
  import cache from '../../assets/scripts/cache'
  export default {
    name: 'fullTextResult',
    data () {
      return {
        pageLoading: false,
        index: 0,
        ap: '',
        clms: '',
        desc: '',
        background: ''
      }
    },
    components: {
      SearchHeader
    },
    computed: {
      ...mapState('fullTextModule', [
        'fullTextList',
        'pagination'
      ]),
      currentPage () {
        let pagination = this.pagination
        return (pagination.start + pagination.size) / pagination.size
      }
    },
    methods: {
      ...mapActions('fullTextModule', [
        'searchFullTextList'
      ]),
      openDetails (row) {
        console.log(row.index)
        this.index = row.index
        this.ap = this.fullTextList[this.index].ap
        this.clms = this.fullTextList[this.index].clms_first_one
        this.desc = this.fullTextList[this.index].desc_first_one
        this.background = this.fullTextList[this.index].background_last_one
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
      clickPagination (curPage) {
        this.pageLoading = true
        this.index=0
        this.searchFullTextList({
          size: this.pagination.size,
          start: (curPage - 1) * this.pagination.size
        }).then(() => {
          this.ap = this.fullTextList[this.index].ap
          this.clms = this.fullTextList[this.index].clms_first_one
          this.desc = this.fullTextList[this.index].desc_first_one
          this.background = this.fullTextList[this.index].background_last_one
          this.pageLoading = false
        })
      }
    },
    beforeRouteUpdate (to, from, next) {
      // this.pageLoading = true
      this.searchFullTextList({
        size: 10,
        start: 0
      }).then(() => {
        this.ap = this.fullTextList[this.index].ap
        this.clms = this.fullTextList[this.index].clms_first_one
        this.desc = this.fullTextList[this.index].desc_first_one
        this.background = this.fullTextList[this.index].background_last_one
        // this.pageLoading = false
      })
      next()
    },
    created () {
      this.pageLoading = true
      this.searchFullTextList({
        size: 10,
        start: 0
      }).then(() => {
        if(this.fullTextList.length != 0) {
          this.ap = this.fullTextList[this.index].ap
          this.clms = this.fullTextList[this.index].clms_first_one
          this.desc = this.fullTextList[this.index].desc_first_one
          this.background = this.fullTextList[this.index].background_last_one
        }
        this.pageLoading = false
      })
    }
  }
</script>
<style scoped>
  .an-list {
    padding: 25px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
  .box-card{
    margin-bottom: 20px;
  }
  .card_head{
    color: #007fff;
  }
  .fulltext{
    line-height: 25px;
    padding: 25px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
</style>
