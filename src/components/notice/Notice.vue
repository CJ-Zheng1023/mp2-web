<template>
  <div class="page page-search">
    <search-header :ifSearch=false ></search-header>
    <div class="main">
      <div class="container-notice">
        <el-card>
          <h1>2018.8.7更新公告</h1>
          <h2>1.标引开关</h2>
          <div class="figure">
            <img src="../../assets/images/1.gif" />
            <div class="figcaption">
              说明:
            </div>
          </div>
          <h2>2.批量操作地址和申请人相同的数据</h2>
          <div class="figure">
            <img src="../../assets/images/2.gif" />
            <div class="figcaption">
              说明:
            </div>
          </div>
          <h2>3.已有标引规则</h2>
          <div class="figure">
            <img src="../../assets/images/3.gif" />
            <div class="figcaption">
              说明:
            </div>
          </div>
          <h2>4.标引规则查询</h2>
          <div class="figure">
            <img src="../../assets/images/4.gif" />
            <div class="figcaption">
              说明:
            </div>
          </div>
          <h2>5.修改标引规则</h2>
          <div class="figure">
            <img src="../../assets/images/5.gif" />
            <div class="figcaption">
              说明:
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import SearchHeader from '../SearchHeader'
export default {
  components: {
    SearchHeader
  }
}
</script>
<style scoped>
  .container-notice{
    background-color: rgba(233, 233, 233, .5);
    padding: 15px;
    border-radius: 7px;
  }
  h1{
    text-align: center;
  }
  .figure{
    text-align: center;
  }
  .figure img{
    width: 800px;
  }
  .figure .figcaption{
    width: 800px;
    margin: 0 auto;
    padding: 30px 0;
    text-align: left;
  }
</style>
