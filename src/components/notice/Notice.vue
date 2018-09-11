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
              说明:当遇到无法标引的数据时可以使用该功能，当关闭标引后输入框会被禁用。关闭标引后点击保存标引按钮即可提交数据。（关闭标引提交后在系统里无法查看该条数据，并且跟该条数据地址和申请人字段相同的数据也无法查看）
            </div>
          </div>
          <h2>2.批量操作地址和申请人相同的数据</h2>
          <div class="figure">
            <img src="../../assets/images/2.gif" />
            <div class="figcaption">
              说明:当遇到地址和申请人字段同时相同的数据时，标引其中一条数据，与其地址和申请人字段相同的数据也会同步标引（关闭标引功能同理）。标引完成之后点击保存标引按钮即可提交数据。
            </div>
          </div>
          <h2>3.已有标引规则</h2>
          <div class="figure">
            <img src="../../assets/images/3.gif" />
            <div class="figcaption">
              说明:当查询的地址字段可以匹配已提交的标引规则时，会把相应的标引规则的标引内容回填到输入框里，并且不可编辑。当鼠标悬浮到标引规则输入框时可以查看标引用户以及标引规则。点击保存标引按钮即可提交数据。
            </div>
          </div>
          <h2>4.标引规则查询</h2>
          <div class="figure">
            <img src="../../assets/images/4.gif" />
            <div class="figcaption">
              说明:点击表格标引规则列的放大镜图标即可查询标引规则，可以根据标引规则和查看范围等查询条件查询相应的标引规则信息。点击箭头图标可以查看详细的标引规则信息。（只可查询当天的标引规则）
            </div>
          </div>
          <h2>5.修改标引规则</h2>
          <div class="figure">
            <img src="../../assets/images/5.gif" />
            <div class="figcaption">
              说明:在标引规则查询窗口，点击编辑按钮即可修改相应的标引规则信息，修改完毕后点击确定即可提交修改数据。（只可修改自己的标引规则）
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
    font-size: 26px;
    font-weight: bold;
    color: #909399;
    margin-bottom: 70px;
  }
  h2{
    padding-left: 30px;
    margin-bottom: 40px;
    font-size: 20px;
    font-weight: bold;
    color: #909399;
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
    font-size: 16px;
    color: #606266;
    line-height: 30px;
  }
</style>
