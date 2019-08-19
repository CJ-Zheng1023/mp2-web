<script src="../../store/modules/patent.js"></script>
<template>
  <div class="page page-search" v-loading="pageLoading">
    <search-header :ifSearch=false>
    </search-header>
    <div class="main">
      <div class="patent-menu" style="font-size: 15px;">
        <div>
          <el-button type="primary" plain  @click="tableShow = true" icon="el-icon-s-unfold">案卷列表</el-button>
        </div>
        <el-drawer
          title="案卷列表"
          custom-class="demo-drawer"
          ref="drawer"
          :visible.sync="tableShow"
          direction="ltr"
          size="33%">
          <div  v-if="compResult.length !=0" >
            <div class="an-list">
                <el-table
                  :data="compResult"
                  border
                  max-height="480"
                  style="width: 100%;" @row-click="openDetails" :row-class-name="tableRowClassName" :row-style="selectHighLight" :header-cell-style="{'background-color': '#007fff','color': 'white','text-align':'left','opacity': '0.7'}" >
                  <el-table-column property="apoldAn" label="申请号"   class="table-item"></el-table-column>
                  <el-table-column property="citedAn" label="对比申请号"  class="table-item"></el-table-column>
                  <el-table-column property="citeType" label="类型"  class="table-item"></el-table-column>
                  <el-table-column property="location" label="排名"  class="table-item"></el-table-column>
                </el-table>
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
            </div>
          </div>
        </el-drawer>
      </div>
      <el-row :gutter="24">
        <!--<el-col :span="7" v-if="compResult.length !=0" class="left-nav">
          <div class="an-list">
            <el-row :gutter="24">
              <el-table
                :data="compResult"
                border
                style="width: 100%;" @row-click="openDetails" :row-class-name="tableRowClassName" :row-style="selectHighLight" :header-cell-style="{'background-color': '#007fff','color': 'white','text-align':'left','opacity': '0.7'}" >
                <el-table-column    prop="apoldAn" label="申请号" width="154" class="table-item"></el-table-column>
                <el-table-column    label="对比文献">
                  <el-table-column  prop="citedAn" label="申请号" width="145" class="table-item"></el-table-column>
                  <el-table-column   prop="citeType" label="类型" width="33" class="table-item"></el-table-column>
                  <el-table-column   prop="location" label="排名" width="61" class="table-item"></el-table-column>
                </el-table-column>
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
        <el-col :span="7" v-else>
          <el-card class="box-card">
            <p>空空如也~</p>
          </el-card>
        </el-col>-->
        <el-col :span="24" v-if="compResult.length !=0">
          <div class="patent-border" v-loading="patentLoading">
            <div class="comp-main">
              <el-row :gutter="24">
                <el-col :span="12" class="selfpatentBaseInfo">
                  <div class="card">
                    <div  class="head">
                      <span><i class="el-icon-notebook-1" style="margin-right: 7px;"></i>本申请专利</span>
                    </div>
                    <div class="card-main">
                      <div class="base">
                        <div class="baseinfo">
                          <div class="patent-item">
                            <label>申请号:</label>
                            <div class="content">{{this.selfpatentBaseInfo.NRD_AN}}</div>
                          </div>
                          <div class="patent-item">
                            <label>分类号:</label>
                            <div class="content"  v-if="this.compResult[this.index]">{{this.compResult[this.index].apIpc}}</div>
                          </div>
                          <div class="patent-item">
                            <label>发明人:</label>
                            <div class="content">{{this.selfpatentBaseInfo.IN}}</div>
                          </div>
                          <div class="patent-item">
                            <label>申请人:</label>
                            <div class="content">{{this.selfpatentBaseInfo.PA}}</div>
                          </div>
                         <!-- <div class="patent-item">
                            <label>国省代码:</label>
                            <div class="content">{{this.selfpatentBaseInfo.CNAME}}</div>
                          </div>-->
                        </div>
                      </div>
                      <div class="grid-content bg-purple">
                        <el-collapse v-model="activeNames" accordion>
                          <div>
                            <el-collapse-item title="发明名称" name="1">
                              <div class="patent-item">
                                <label>发明名称:</label>
                                <div class="content" tabindex='-1' @keyup.18="markPatentWord(1, $event)"  v-html="this.selfpatentBaseInfo.TI"></div>
                               <!-- <template>
                                  <el-radio-group v-model="patentType">
                                    <el-radio :label="2">产品</el-radio>
                                    <el-radio :label="1">方法</el-radio>
                                    <el-radio :label="3">组合型</el-radio>
                                  </el-radio-group>
                                </template>-->
                              </div>
                              <div class="refer">
                                <i class="el-icon-star-off"></i><label>标题拆词参考:</label>
<!--
                                <el-button type="primary" plain size="mini" @click="addPatentMark(1)" style="float: right">添加</el-button>
-->
                              </div>
                              <div class="segment-refer" >
                                <p>
                                  <el-tag :disable-transitions=true  @close="removeErrorKeyWord(item)" :closable="true" :type="item.an ? 'primary' : 'primary'" class="mark-item"  v-for="item in patentChaiCiTi" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                                </p>
                              </div>
                            </el-collapse-item>
                          </div>
                          <div>
                            <el-collapse-item title="权利要求拆词参考" name="4">
                              <div class="marks-scroll patent-height">
                                <div class="marks">
                                  <div class="refer">
                                    <i class="el-icon-star-off"></i><label>权力要求拆词参考:</label>
<!--
                                    <el-button type="primary" plain size="mini" @click="addPatentCMLSMark(2)" style="float: right">添加</el-button>
-->
                                  </div>
                                  <div class="segment-refer">
                                    <p>
                                      <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'primary'"  @close="removeErrorKeyWord(item)" :closable="true" class="mark-item"  v-for="item in patentCLMSChaiCiTi" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </el-collapse-item>
                          </div>
                          <div>
                            <el-collapse-item title="权利要求" name="3">
                              <div class="marks-scroll patent-height">
                                <div class="marks">
                                  <div class="clearfocusoutline" tabindex='-1' @keyup.18="markPatentWord(2, $event)" v-html="selfpatentBaseInfo.CLIMS"></div>
                                </div>
                              </div>
                            </el-collapse-item>
                          </div>
                          <el-collapse-item title="摘要" name="6">
                            <div v-html="this.selfpatentBaseInfo.AB">
                            </div>
                          </el-collapse-item>
                          <div>
                            <el-collapse-item title="说明书拆词参考" name="5">
                              <div class="marks-scroll patent-height">
                                <div class="marks">
                                  <div class="refer">
                                    <i class="el-icon-star-off"></i><label>说明书拆词参考:</label>
<!--
                                    <el-button type="primary" plain size="mini" @click="addPatentDESCMark(3)" style="float: right">添加</el-button>
-->
                                  </div>
                                  <div class="segment-refer">
                                    <p>
                                      <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'primary'"  @close="removeErrorKeyWord(item)" :closable="true" class="mark-item"  v-for="item in patentDESCChaiCiTi" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </el-collapse-item>
                          </div>
                          <div>
                              <el-collapse-item title="说明书" name="2">
                                <div class="marks-scroll patent-height">
                                  <div class="marks">
                                   <!-- <div >说明书拆词如下:</div>
                                    <div style="min-height: 50px;margin-top:10px;">
                                      <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'warning'"  class="mark-item" @close="closePatentMark(item)" :closable="true"  v-for="item in patentDESCWords" :key="item.word + item.type">{{item.word}}</el-tag>
                                    </div>-->
                                    <div class="clearfocusoutline" tabindex='-1' @keyup.18="markPatentWord(2, $event)"  v-html="selfpatentBaseInfo.DESC">
                                    </div>
                                  </div>
                                </div>
                              </el-collapse-item>
                          </div>
                        </el-collapse>
                     <!--   <div class="Chaici">
                          <div >标题拆词如下:</div>
                          <div style="min-height: 50px;margin-top:10px;">
                            <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'warning'"  class="mark-item" @close="closePatentMark(item)" :closable="true"  v-for="item in patentTiWords" :key="item.word + item.type">{{item.word}}</el-tag>
                          </div>
                          <div class="input-title">手动输入标题词:</div>
                          <div class="manual-input">
                            <el-input
                              type="textarea"
                              :rows="2"
                              placeholder="请输入内容" v-model="inputTitleWord">
                            </el-input>
                            <el-button type="success" plain @click="addTitleWord" size="medium">添加</el-button>
                          </div>
                        </div>
                        <div class="Chaici othersChaici">
                          <div >其他自段拆词如下:</div>
                          <div style="min-height: 50px;margin-top:10px;">
                            <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'warning'"  class="mark-item" @close="closePatentMark(item)" :closable="true" v-for="item in patentCLMSWords" :key="item.word + item.type">{{item.word}}</el-tag>
                          </div>
                          <div class="input-title">手动输入权利要求,说明书中关键词:</div>
                          <div class="manual-input">
                            <el-input
                              type="textarea"
                              :rows="2"
                              placeholder="请输入内容" v-model="inputOthersWord">
                            </el-input>
                            <el-button type="success" plain @click="addInputWord" size="medium">添加</el-button>
                          </div>
                        </div>-->
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12"  v-if="citepatentBaseInfo" class="citepatentBaseInfo">
                  <div class="card">
                    <div class="head">
                      <span><i class="el-icon-notebook-2" style="margin-right: 7px;"></i> 对比文献专利</span>
                    </div>
                    <div class="card-main">
                      <div class="base">
                        <div class="baseinfo">
                          <div class="patent-item">
                            <label>申请号:</label>
                            <div class="content">{{this.citepatentBaseInfo.NRD_AN}}</div>
                          </div>
                          <div class="patent-item">
                            <label>分类号:</label>
                            <div class="content">{{this.compResult[this.index].cIpc}}</div>
                          </div>
                          <div class="patent-item">
                            <label>发明人:</label>
                            <div class="content">{{this.citepatentBaseInfo.IN}}</div>
                          </div>
                          <div class="patent-item">
                            <label>申请人:</label>
                            <div class="content">{{this.citepatentBaseInfo.PA}}</div>
                          </div>
                          <!--<div class="patent-item">
                            <label>国省代码:</label>
                            <div class="content">{{this.citepatentBaseInfo.CNAME}}</div>
                          </div>-->
                        </div>
                      </div>
                      <div class="grid-content bg-purple-light">
                        <el-collapse v-model="activeNames" accordion>
                          <div>
                            <el-collapse-item title="发明名称" name="1" class="collapse-title">
                              <div class="patent-item">
                                <label>发明名称:</label>
                                <div class="content" tabindex='-1' @keyup.18="markCitedPatentWord(1, $event)"  v-html="this.citepatentBaseInfo.TI"></div>
                              </div>
                              <div class="refer">
                                <i class="el-icon-star-off"></i><label>标题拆词参考:</label>
<!--
                                <el-button type="primary" plain size="mini" @click="addCitedPatentMark(1)"  style="float: right">添加</el-button>
-->
                              </div>
                              <div class="segment-refer">
                                <p>
                                  <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'primary'" @close="removeErrorKeyWord(item)" :closable="true"  class="mark-item"  v-for="item in citedChaiCiTi" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                                </p>
                              </div>
                            <!--  <div >标题拆词如下:</div>
                              <div style="min-height: 50px;margin-top:10px;">
                                <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'warning'"  class="mark-item" @close="closeCitedPatentMark(item)" :closable="true"  v-for="item in citedPatentTiWords" :key="item.word + item.type">{{item.word}}</el-tag>
                              </div>-->
                            </el-collapse-item>
                          </div>
                          <div>
                            <el-collapse-item title="权利要求拆词参考" name="4">
                            <div class="marks-scroll patent-height">
                              <div class="marks">
                                <div class="refer">
                                  <i class="el-icon-star-off"></i><label>权力要求拆词参考:</label>
<!--
                                  <el-button type="primary" plain size="mini" @click="addCitedPatentCMLSMark(2)" style="float: right">添加</el-button>
-->
                                </div>
                                <div class="segment-refer">
                                  <p>
                                    <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'primary'" @close="removeErrorKeyWord(item)" :closable="true" class="mark-item"  v-for="item in citedCLMSChaiCiTi" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                                  </p>
                                </div>
                              </div>
                            </div>
                            </el-collapse-item>
                          </div>
                          <div>
                            <el-collapse-item title="权利要求" name="3">
                              <div class="marks-scroll patent-height">
                                <div class="marks">
                                  <!--<div >权力要求拆词如下:</div>
                                  <div style="min-height: 50px;margin-top:10px;">
                                    <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'warning'"  class="mark-item" @close="closeCitedPatentMark(item)" :closable="true"  v-for="item in citedPatentCLMSWords" :key="item.word + item.type">{{item.word}}</el-tag>
                                  </div>-->
                                  <div class="clearfocusoutline" tabindex='-1' @keyup.18="markCitedPatentWord(2, $event)"  v-html="this.citepatentBaseInfo.CLIMS"></div>
                                </div>
                              </div>
                            </el-collapse-item>
                          </div>
                          <el-collapse-item title="摘要" name="6">
                            <div v-html="this.citepatentBaseInfo.AB">
                            </div>
                          </el-collapse-item>
                          <div>
                            <el-collapse-item title="说明书拆词参考" name="5">
                              <div class="marks-scroll patent-height">
                                <div class="marks">
                                  <div class="refer">
                                    <i class="el-icon-star-off"></i><label>说明书拆词参考:</label>
<!--
                                    <el-button type="primary" plain size="mini" @click="addCitedPatentDESCMark(3)" style="float: right">添加</el-button>
-->
                                  </div>
                                  <div class="segment-refer">
                                    <p>
                                      <el-tag :disable-transitions=true :type="item.an ? 'primary' : 'primary'" @close="removeErrorKeyWord(item)" :closable="true" class="mark-item"  v-for="item in citedDESCChaiCiTi" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </el-collapse-item>
                          </div>
                          <div>
                            <el-collapse-item title="说明书" name="2">
                              <div class="marks-scroll patent-height">
                                <div class="marks">
                                <!--  <div >说明书拆词如下:</div>
                                  <div style="min-height: 50px;margin-top:10px;">
                                    <el-tag :disable-transitions=true :type="item.an? 'primary' : 'warning'"  class="mark-item" @close="closeCitedPatentMark(item)" :closable="true"  v-for="item in citedPatentDESCWords" :key="item.word + item.type">{{item.word}}</el-tag>
                                  </div>-->
                                  <div class="clearfocusoutline" tabindex='-1' @keyup.18="markCitedPatentWord(3, $event)" v-html="this.citepatentBaseInfo.DESC"></div>
                                </div>
                              </div>
                            </el-collapse-item>
                          </div>
                        </el-collapse>
                      </div>
                    </div>
                    </div>
                </el-col>
                <el-col :span="12"  v-else>
                  <el-card class="box-card">
                    <p>空空如也~</p>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="24" v-else>
          <el-card class="box-card">
            <p>空空如也~</p>
          </el-card>
        </el-col>
      </el-row>
      <div class="patent-border">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="color:#409EFF"> <i class="el-icon-edit"></i> 请输入检索式</span>
              </div>
              <div >
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容" v-model="searchWords">
                </el-input>
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容" v-model="searchWords2">
                </el-input>
                <div style="margin-bottom: 10px;margin-top: 10px;font-size: 10px;"> 常用符号：</div>
                <div style="margin-bottom: 10px;margin-top: 10px;"> <el-button  size="mini"  @click="addSymbol('(')"> ( </el-button> <el-button  size="mini"  @click="addSymbol(')')"> ) </el-button> <el-button  size="mini"  @click="addSymbol('and')"> and </el-button> <el-button  size="mini"  @click="addSymbol('or')"> or </el-button></div>
                <div style="margin-bottom: 10px;">
                  <el-button  size="mini"  @click="addSymbol('{}')"> {} </el-button>
                  <el-button  size="mini"  @click="addSymbol('[]')"> [] </el-button>
                  <el-button   size="mini"  @click="addSymbol('<>')"> &lt;&gt; </el-button>
                </div>
                <div style="margin-bottom: 10px;margin-top: 10px;">
                  <div style="margin-bottom: 10px;font-size: 10px;"> 等同概念：</div>
                  <span><el-button round  size="mini" @click="addSymbol('[基团 or 烷基or 烃基 or 苯基 or氨基 or卤代基or羟基]')"> [基团 or 烷基or 烃基 or 苯基 or氨基 or卤代基or羟基] </el-button></span>
                  <span><el-button round size="mini" @click="addSymbol('{电解液 or 电解质}')"> {电解液 or 电解质} </el-button></span>   <span><el-button round  size="mini" @click="addSymbol('[循环 or 再生 or 二次 ]')">[循环 or 再生 or 二次 ] </el-button></span> <span><el-button round  size="mini" @click="addSymbol('<无机氧化物 or 陶瓷>')"> &lt;无机氧化物 or 陶瓷&gt;  </el-button></span>
                </div>
                <div >
                  <!--<el-button :loading="btnLoading" type="primary" @click="onSubmit" :disabled="saved">保存标引词</el-button>-->
                  <el-button :loading="btnLoading" type="primary" @click="onSubmit" :disabled="savedSearchWordsbtn">保存检索式</el-button>
                  <el-button-group class="prev-next-btn"><el-button type="primary" plain  @click="prev" class="prev-patent" icon="el-icon-arrow-left">上一篇</el-button><el-button type="primary" plain  @click="next" class="next-patent">下一篇<i class="el-icon-arrow-right el-icon--right"></i></el-button></el-button-group>
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
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
     <!-- <el-row :gutter="24">
        <el-col :span="17" :offset="7">
            <div class="patent-border" v-loading="locationLoading">
                <el-card class="box-card">
                  <div style="margin-bottom: 10px;">
                    <el-input v-model="locationInputValue"  style="width:200px;" placeholder="请输入内容"></el-input>
                    <template v-if="compResult[index]">
                      <el-tag type="success">本申请号:{{this.compResult[index].an}}</el-tag>
                      <el-tag type="success">对比文献申请号:{{this.compResult[index].citedAn}}</el-tag>
                      <el-tag type="success">对比文献排名:{{this.compResult[index].location}}</el-tag>
                    </template>
                    <el-button type="success" plain @click="searcLocationResult" size="medium">提交</el-button>
                  </div>
                  <div class="location-list" v-if="this.showPatentLocationList !=null">
                    <div>
                      <el-table
                        :data="lcoationListFilter"
                        border
                        style="width: 100%;"  :header-cell-style="{'background-color': '#9999D1','color': '#5E5E5E','text-align':'left','opacity': '0.7','height':'5px'}" >
                        <el-table-column prop="an" label="申请号"  class="table-item"></el-table-column>
                        <el-table-column prop="ti" label="标题" class="table-item"></el-table-column>
                        &lt;!&ndash;  <el-table-column prop="score" label="得分"  class="table-item"></el-table-column>&ndash;&gt;
                        <el-table-column label="排名" prop="XH" class="table-item"></el-table-column>
                      </el-table>
                    </div>
                  </div>
                </el-card>
            </div>
        </el-col>
      </el-row>-->
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="patent-border">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="color:#409EFF">文本拆词: </span>
                <template v-if="compResult[index]">
                  <el-tag type="success">本申请号:{{this.compResult[index].an}}</el-tag>
                  <el-tag type="success">对比文献申请号:{{this.compResult[index].citedAn}}</el-tag>
                  <el-tag type="success">对比文献排名:{{this.compResult[index].location}}</el-tag>
                </template>
                <el-button size="mini" type="primary" plain  @click="searchsortByKeywordFreqs">查询</el-button>
              </div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 80}"
                placeholder="请输入内容"
                v-model="sortByKeywordFreqsText" style="margin-bottom:20px;">
              </el-input>
              <div>
                <p>
                  <el-tag :disable-transitions=true :type="item.id ? 'primary' : 'success'" class="mark-item"  v-for="item in sortByKeywordFreqsList" :key="item.freq + item.word">{{item.word}} :{{item.freq}}</el-tag>
                </p>
              </div>
            </el-card>
          </div>
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
  name: 'patentResult',
  data () {
    return {
      patentLoading: false,
      pageLoading: false,
      activeNames: ['1'],
      index: 0,
      message: '',
      btnLoading: false,
      sortByKeywordFreqsText: '',
      inputPatentAn: '',
      inputOthersWord: '',
      searchWords:'',
      searchWords2:'',
      locationLoading: '',
      inputTitleWord: '',
      patentType: 2,
      tableShow: false
    }
  },
  computed: {
    locationInputValue () {
      return this.compResult[this.index].an
    },
    currentPage () {
      let pagination = this.pagination
      return (pagination.start + pagination.size) / pagination.size
    },
    ...mapState('patentModule', [
      'compResult',
      'pagination',
      'selfpatentBaseInfo',
      'citepatentBaseInfo',
      'patentChaiCiTi',
      'citedChaiCiTi',
      'patentCLMSChaiCiTi',
      'patentDESCChaiCiTi',
      'citedCLMSChaiCiTi',
      'citedDESCChaiCiTi',
      'patentMarkList',
      'citedPatentMarkList',
      'sortByKeywordFreqsList',
      'showPatentLocationList',
      'SearchWordMark'
    ]),
   /* lcoationListFilter () {
      let m = Object
      let list = [];
      console.log(this.compResult[this.index].an)
      this.showPatentLocationList.forEach((item ,index)=>{
            if(item.an === this.compResult[this.index].citedAn){
              let  m = Object.create(null)
              m['an'] = item.an
              m['ti'] = item.ti
              m['XH'] = index + 1
              list.push(m)
              console.log(index)
            }

      })
      return list
    },*/
  /*  patentTiWords () {
      let marks = this.patentMarkList
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 1)
    },
    patentCLMSWords () {
      let marks = this.patentMarkList
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 2)
    },*/
   /* patentDESCWords () {
      let marks = this.patentMarkList
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 3)
    },*/
    /*citedPatentTiWords () {
      let marks = this.citedPatentMarkList
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 1)
    },
    citedPatentCLMSWords () {
      let marks = this.citedPatentMarkList
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 2)
    },*/
   /* citedPatentDESCWords () {
      let marks = this.citedPatentMarkList
      if (!marks) {
        return []
      }
      return marks.filter(mark => Number(mark.type) === 3)
    },*/
    selfCLMS () {
      let clmsStr = this.selfpatentBaseInfo.CLIMS
      return this._formatCLMS(clmsStr)
    },
    citeCLMS () {
      let clmsStr = this.citepatentBaseInfo.CLIMS
      return this._formatCLMS(clmsStr)
    },
    savedSearchWordsbtn (){
      let flag = true
      if (this.searchWords == '') {
        return flag
      }else{
        return false
      }
    },
   /* saved () {
      let flag = true
      console.log(this.patentMarkList)
      if (!this.patentMarkList) {
        return flag
      }
      for (let i = 0, length = this.patentMarkList.length; i < length; i++) {
        let item = this.patentMarkList[i]
        if (!item.an) {
          flag = false
          break
        }
        }
      return flag
      /!*let flag = true
      if (!this.patentMarkList) {
        return flag
      }
      let patentflag =true
      for (let i = 0, length = this.patentMarkList.length; i < length; i++) {
        let item = this.patentMarkList[i]
        if (!item.an) {
          patentflag = false
          break
        }
      }*!/
     /!* let citedflag =true
      for (let i = 0, length = this.citedPatentMarkList.length; i < length; i++) {
        let item = this.citedPatentMarkList[i]
        if (!item.an) {
          citedflag = false
          break
        }
      }
      if (citedflag==false && patentflag==false) {
        return false
      } else {
        return true
      }*!/
    }*/
  },
  methods: {
   /* _setPatentType () {
      this.patentType = this.patentMarkList[0] ? this.patentMarkList[0].inv_type : 2
    },*/
   /* addTitleWord () {
      var type = 1
      var word = this.inputTitleWord.split(',')
      word.forEach((item,index)=>{
        var word= item
        this.patentMarkList.push({
          type,
          word
        })
      })
      this.inputTitleWord=''
    },
    addInputWord (){
      var type = 2
      var word = this.inputOthersWord.split(',')
      word.forEach((item,index)=>{
        var word= item
        this.patentMarkList.push({
          type,
          word
        })
      })
      this.inputOthersWord=''
    },
    searcLocationResult (){
       var an= this.locationInputValue
       this.locationLoading = true
       this.searchPatentLocation({an}).then(() => {
         this.locationLoading = false
       })
    },*/
    removeErrorKeyWord (item) { //将调用接口拆词 人工判断错误后保存入数据库表
      var key =item.word
      this.patentLoading = true
      this.removeErrorKeyWords({key}).then(() => {
        this.patentLoading = false
        //alert("删除成功")
      })
    },
    searchsortByKeywordFreqs () {   // 传入一段文本  拆词
      this.patentLoading = false
      var text = this.sortByKeywordFreqsText
      this.sortByKeywordFreqs({text}).then(() => {
        this.patentLoading = false
      })
    },
    /*onSubmit () {
      var invtype = this.patentType
      this.btnLoading = true
      var an = this.compResult[this.index].an
      var citedAn = this.compResult[this.index].citedAn === '' ? '1' : this.compResult[0].citedAn
      var patentmarkList=this.patentMarkList
      var citedpatentmarkList=this.citedPatentMarkList
      let marks = []
      patentmarkList.forEach(mark => {
        let  m = Object.create(null)
        m['an'] = an
        m['type'] = mark['type']
        m['word'] = mark['word']
        marks.push(m)
      })
      this.addPatentMarks({an,marks,invtype}).then(data => {
        if (data.flag) {
          this.$alert('添加成功', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          }).then(action => {
            this.loading = true
            this.showPatentMarkList({
              an: an,
              citedAn: citedAn
            }).then(() => {
              this.loading = false
              this.btnLoading = false
            })
          })
        } else {
          this.$alert('添加失败', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(action => {
            this.btnLoading = false
          })
        }
      })
    },*/
    onSubmit () {    // 保存特征检索式
      this.btnLoading = true
      var an = this.compResult[this.index].an
      var citedAn = this.compResult[this.index].citedAn === '' ? '1' : this.compResult[this.index].citedAn
      var searchwords = this.searchWords
      var searchwords2 = this.searchWords2
      var categoryType = this.compResult[this.index].citeType
      console.log(categoryType)
      console.log(an)
      console.log(citedAn)
      console.log(searchwords)
      this.addSearchWords({an,citedAn,searchwords,categoryType,searchwords2}).then(data => {
        if (data.flag) {
          this.$alert('添加成功', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          }).then(action => {
            this.loading = true
            this.showSearchWorkMark({
              an: an,
              citedAn: citedAn
            }).then(() => {
              console.log(this.SearchWordMark)
              this.searchWords = this.SearchWordMark.searchwords
              this.searchWords2 = this.SearchWordMark.searchwords2
              this.loading = false
              this.btnLoading = false
            })
          })
        } else {
          this.$alert('添加失败', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(action => {
            this.btnLoading = false
          })
        }
      })
    },
    _formatCLMS (origin) {   //格式化权利要求
      let html = origin || ''
      let number = html.match(/[0-9]+[.]/g)
      if (number) {
        for(let i = 0, len = number.length; i < len; i++){
          if (i === 0) {
            html = html.replace(number[i], number[i] + '<span style="color: #409EFF;">')
          } else {
            html = html.replace(number[i], '</span>' + number[i] + '<span>')
          }
          html = html.replace(number[i], `<span style="color:blue;font-size: 18px;">${number[i]}</span>`)
        }
        html += '</span>'
      }
      return html
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
    },
    clickPagination (curPage) {
      this.patentLoading = true
      this.index=0
      this.activeNames=['1']
      this.searchPatentListFormTwo({
        size: this.pagination.size,
        start: (curPage - 1) * this.pagination.size
      }).then(() => {
        var an = this.compResult[0].an
        var citedAn = this.compResult[0].citedAn === '' ? '1' : this.compResult[0].citedAn
        this.searchPatentDetailUnion({an,citedAn}).then(() => {
         // this._setPatentType();
          this.searchWords = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords
          this.searchWords2 = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords2
          this.patentLoading = false
        })
      })
    },
    openDetails (row) {
      this.searchWords = ''
      this.index = row.index
      this.activeNames=['1']
    /*  this.showPatentLocationList=[]
      console.log(this.showPatentLocationList)*/
      var an = row.an
      var citedAn = row.citedAn === '' ? '1' : row.citedAn
      console.log(citedAn)
      this.patentLoading = true
      this.searchPatentDetailUnion({an,citedAn}).then(() => {
        //this._setPatentType()
        this.searchWords = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords
        this.searchWords2 = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords2
        this.patentLoading = false
      })
    },
    prev () {
      if (this.index === 0) {
        alert('已经是第一篇文献了')
        this.message = `已经是第一篇文献了:${+new Date()}`
      } else {
        this.activeNames=['1']
        this.message = ''
        this.patentLoading = true
        this.index = this.index - 1
        var an = this.compResult[this.index].an
        var citedAn = this.compResult[this.index].citedAn === '' ? '1' : this.compResult[this.index].citedAn
        this.searchPatentDetailUnion({an,citedAn}).then(() => {
          //this._setPatentType()
          this.searchWords = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords
          this.searchWords2 = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords2
          this.patentLoading = false
        })
      }
    },
    next () {
      if (this.index === this.compResult.length - 1) {
        alert('已经是最后一篇文献了')
        this.message = `已经是最后一篇文献了:${+new Date()}`
      } else {
        this.activeNames=['1']
        this.message = ''
        this.patentLoading = true
        this.index = this.index + 1
        var an = this.compResult[this.index].an
        var citedAn = this.compResult[this.index].citedAn === '' ? '1' : this.compResult[this.index].citedAn
        this.searchPatentDetailUnion({an,citedAn}).then(() => {
          //this._setPatentType()
          this.searchWords = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords
          this.searchWords2 = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords2
          this.patentLoading = false
        })
      }
    },
    selectHighLight ({row, rowIndex}) {
      if (this.index === rowIndex) {
        return {
          'background-color': '#d9edf7',
          'cursor': 'pointer'
        }
      }
    },
  /*  addPatentMark (type) {
      let marks = this.patentMarkList
      this.patentChaiCiTi.forEach(mark => {
        let  m = Object.create(null)
        m['type'] = type
        m['word'] = mark['word']
        marks.push(m)
      })
    },
    addPatentCMLSMark (type) {
      let marks = this.patentMarkList
      this.patentCLMSChaiCiTi.forEach(mark => {
        let  m = Object.create(null)
        m['type'] = type
        m['word'] = mark['word']
        marks.push(m)
      })
    },
    addPatentDESCMark (type) {
      let marks = this.patentMarkList
      this.patentDESCChaiCiTi.forEach(mark => {
        let  m = Object.create(null)
        m['type'] = type
        m['word'] = mark['word']
        marks.push(m)
      })
    },
    addCitedPatentMark (type) {
      let marks = this.citedPatentMarkList
      this.citedChaiCiTi.forEach(mark => {
        let  m = Object.create(null)
        m['type'] = type
        m['word'] = mark['word']
        marks.push(m)
      })
    },
    addCitedPatentCMLSMark (type) {
      let marks = this.citedPatentMarkList
      this.citedCLMSChaiCiTi.forEach(mark => {
        let  m = Object.create(null)
        m['type'] = type
        m['word'] = mark['word']
        marks.push(m)
      })
    },
    addCitedPatentDESCMark (type) {
      let marks = this.citedPatentMarkList
      this.citedDESCChaiCiTi.forEach(mark => {
        let  m = Object.create(null)
        m['type'] = type
        m['word'] = mark['word']
        marks.push(m)
      })
    },*/
    _getSelectText () {
      let text = ''
      if (window.getSelection) {
        text = window.getSelection().toString()
      } else if (document.selection && document.selection.type !== 'Control') {
        text = document.selection.createRange().text
      }
      return text
    },
    markPatentWord (type, event) {
      let word = this._getSelectText()
      this.searchWords = this. searchWords +' '+ word
    },
    addSymbol (symbol){
      this.searchWords = this. searchWords + ' '+ symbol
    },
   /* markPatentWord (type, event) {
      let word = this._getSelectText()
      let flag = false
      for (let i = 0, len = this.patentMarkList.length; i < len; i++) {
        let item = this.patentMarkList[i]
        if (word + type === item.word + item.type) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$alert(`${word}已添加为标引词`, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return
      }
      this.patentMarkList.push({
        type,
        word,
        userId: window.localStorage.getItem('userId')
      })
    },
    markCitedPatentWord (type, event) {
      let word = this._getSelectText()
      let flag = false
      for (let i = 0, len = this.citedPatentMarkList.length; i < len; i++) {
        let item = this.citedPatentMarkList[i]
        if (word + type === item.word + item.type) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$alert(`${word}已添加为标引词`, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return
      }
      this.citedPatentMarkList.push({
        type,
        word,
        userId: window.localStorage.getItem('userId')
      })
    },
    closePatentMark (mark) {
      this.patentMarkList.splice(this.patentMarkList.indexOf(mark), 1)
    },
    closeCitedPatentMark (mark) {
      this.citedPatentMarkList.splice(this.citedPatentMarkList.indexOf(mark), 1)
    },*/
    ...mapActions('patentModule', [
      'searchPatentsList',
      'searchPatentListFormTwo',
      'searchAnDetail',
      'showPatentMarkList',
      'searchPatentDetailUnion',
      'addPatentMarks',
      'sortByKeywordFreqs',
      'removeErrorKeyWords',
      'searchPatentLocation',
      'addSearchWords',
      'showSearchWorkMark'
    ])
  },
  components: {
    SearchHeader
  },
  beforeRouteUpdate (to, from, next) {
    this.pageLoading = true
    this.searchPatentsList().then(() => {
      var an = this.compResult[0].an
      var citedAn = this.compResult[0].citedAn === '' ? '1' : this.compResult[0].citedAn
      this.searchPatentDetailUnion({an,citedAn}).then(() => {
        this.pageLoading = false
      })
    })
    next()
  },
  created () {
    this.pageLoading = true
    this.patentLoading = true
    this.searchPatentsList().then(() => {
      if(this.compResult.length != 0) {
        var an = this.compResult[0].an
        var citedAn = this.compResult[0].citedAn === '' ? '1' : this.compResult[0].citedAn
        this.searchPatentDetailUnion({an,citedAn}).then(() => {
          this.searchWords = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords
          this.searchWords2 = this.SearchWordMark == null ? '':this.SearchWordMark.searchwords2
          this.pageLoading = false
          this.patentLoading = false
        })
      }
    })
  }
}
</script>
<style scoped>
  .page {
    background-image: url('../../assets/images/bg1.jpg')!important;
    background-attachment: fixed;
    background-size: cover;
  }
  .page-search .main {
    max-width: 1340px !important;
  }
  .patent-detail {
    margin-top:10px;
    padding: 10px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
  }
  .an-list {
    padding-left: 15px;
   /* background-color: rgba(233, 233, 233, .5);*/
    border-radius: 7px;
  }
  .table-item {
    color:#409EFF;
  }
  .pagination {
    margin-top: 10px;
    margin-left: -15px;
  }
/*  .prev-next-btn{
    float: left;
  }*/
  .patent-item label{
    float: left;
    padding-right: 10px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
  }
  .patent-item{
    margin-bottom: 10px;
  }
  .patent-item .content{
    margin-left: 80px;
    line-height: 40px;
    font-size: 14px;
    word-break: break-all;
    word-wrap: break-word;
  }
  .card{
    background-color: white;
    border-radius: 15px;
    border-radius: inherit;
    -moz-box-shadow: inset 0 0 10px #CCC;
    -webkit-box-shadow: inset 0 0 10px #CCC;
    box-shadow: inset 0 0 10px #CCC;
  }
  .card .head{
     background-color:#ecf5ff;
     color: #409EFF;
     /*font-weight: 500;*/
     text-align: center;
     padding:15px 20px;
     border-color: #b3d8ff;
  }
  .card .card-main{
    padding:15px 20px;
  }
/*  .card .card-main .baseinfo{
    min-height:280px;
    max-height:350px;
  }*/
  .refer label{
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
  }
  .refer{
    padding-left:20px;
    position: relative;
  }
  .refer i{
    position: absolute;
    left:0;
    top:28%;
  }
  .patent-height{
    overflow-y: auto;
    max-height: 500px;
    overflow-x: hidden;
  }
  .patent-item .content:focus {
    outline: none;
  }
  .clearfocusoutline:focus {
    outline: none;
  }
  .el-collapse{
    border-top:none;
    border-bottom: none;
  }
  .segment-refer .el-tag{
    font-weight: bold;
  }
  .el-collapse-item__wrap{
    border-bottom: none;
  }
  .Chaici{
    font-size: 13px;
  }
  .input-title {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .Chaici .manual-input .el-textarea {
     width:80%;
  }
  .mark-item{
    margin-bottom: 5px;
    margin-right: 8px;
  }
  .patent-border{
    padding: 15px;
    background-color: rgba(233, 233, 233, .5);
    border-radius: 7px;
    margin-bottom:10px;
    margin-top:5px;
  }

</style>
