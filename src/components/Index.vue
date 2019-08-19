<template>
  <div class="page page-search">
    <search-header :ifSearch=false ></search-header>
    <div class="main" style="width: 900px;margin-top: 250px;">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-header" style="background: linear-gradient(90deg, #000000, #444444)">
              <img src="../assets/images/card-bg.png" width="100%" />
              <div class="circle" style="background-color: #006eff;">
                <i class="fa fa-2x fa-address-card-o" style="color: #fff;"></i>
              </div>
            </div>
            <div style="padding: 14px;">
              <router-link to="/address">
                <el-button type="text" class="button">地址标引</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>
    <!--    <el-col :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-header" style="background: linear-gradient(90deg, #2c95c2, #72ebfd);">
              <img src="../assets/images/card-bg.png" width="100%" />
              <div class="circle" style="background-color: #066da5;">
                <i class="fa fa-2x fa-language" style="color: #fff;"></i>
              </div>
            </div>
            <div style="padding: 14px;">
              <router-link to="/ipc">
                <el-button type="text" class="button">IPC标引</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>-->
      <!--  <el-col :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-header" style="background: linear-gradient(90deg, #145978, #1e769c);">
              <img src="../assets/images/card-bg.png" width="100%" />
              <div class="circle">
                <i class="fa fa-2x fa-key" style="color: #00adef;"></i>
              </div>
            </div>
            <div style="padding: 14px;">
              <router-link to="/compSearch">
                <el-button type="text" class="button">Ipc案卷比对</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>-->
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-header" style="background: linear-gradient(90deg, #145978, #1e769c);">
              <img src="../assets/images/card-bg.png" width="100%" />
              <div class="circle">
                <i class="fa fa-2x fa-key" style="color: #00adef;"></i>
              </div>
            </div>
            <div style="padding: 14px;">
              <router-link to="/patent">
                <el-button type="text" class="button">案卷比对</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>
        <!--<el-col :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-header" style="background: linear-gradient(90deg, #145978, #1e769c);">
              <img src="../assets/images/card-bg.png" width="100%" />
              <div class="circle">
                <i class="fa fa-2x fa-key" style="color: #00adef;"></i>
              </div>
            </div>
            <div style="padding: 14px;">
              <router-link to="/electricalSearch">
                <el-button type="text" class="button">电学发明标题标引</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>-->
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-header" style="background: linear-gradient(90deg, #145978, #1e769c);">
              <img src="../assets/images/card-bg.png" width="100%" />
              <div class="circle">
                <i class="fa fa-2x fa-key" style="color: #00adef;"></i>
              </div>
            </div>
            <div style="padding: 14px;">
              <router-link to="/ZKPatentMark">
                <el-button type="text" class="button">智库案卷标引</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-header" style="background: linear-gradient(90deg, #145978, #1e769c);">
              <img src="../assets/images/card-bg.png" width="100%" />
              <div class="circle">
                <i class="fa fa-2x fa-key" style="color: #00adef;"></i>
              </div>
            </div>
            <div style="padding: 14px;">
              <router-link to="/ZKPatentMarkTemp">
                <el-button type="text" class="button">案卷测试标引</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-header" style="background: linear-gradient(90deg, #145978, #1e769c);">
              <img src="../assets/images/card-bg.png" width="100%" />
              <div class="circle">
                <i class="fa fa-2x fa-key" style="color: #00adef;"></i>
              </div>
            </div>
            <div style="padding: 14px;">
              <router-link to="/FullText">
                <el-button type="text" class="button">全文文本</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import SearchHeader from './SearchHeader'
export default {
  components: {
    SearchHeader
  }
}
</script>
<style scoped>
  .card-header{
    position: relative;
  }
  .circle{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    background-color: #fff;
    text-align: center;
  }
  .circle i{
    line-height: 80px;
  }
  .el-card{
    border: none;
    text-align: center;
  }
</style>
