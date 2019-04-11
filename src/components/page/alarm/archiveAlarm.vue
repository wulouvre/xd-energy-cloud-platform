<template>
    <div class="divcontent">
        <div>
            <p>查询历史告警</p>
        </div>
        <div  class="sl-v-list">
            <!--<span>时间范围：</span>
                <el-date-picker
                    v-model="valuetime"
                    type="datetimerange"
                    :picker-options="pickerOptions2"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>-->
                  <span class="sapn-margin-left left title" style="margin-top: 4px;">开始时间：</span>
                            <el-date-picker  style="margin-left: 3px;"
                                class="left  text-width"
                                v-model="startTime"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>

                            <span class="sapn-margin-left  left title" style="margin-top: 4px;">结束时间：</span>
                            <el-date-picker
                                 class="left  text-width"
                                v-model="endTime"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
            <el-button type="primary"  class="left"  style="margin-left: 8px;" @click="selected">查询</el-button>
             <span  class="more left" style="margin-left: 8px;margin-top: 4px;color:#4066F7;" @click="more=true" v-show="!more">更多</span>
        </div>
        <!--<div class="sl-v-list">
            <span class="left">告警级别：</span>
            <div>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="left">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange"  class="left" >
                    <el-checkbox v-for="city in cities" :label="city" :key="city"  >{{city}}</el-checkbox>
                </el-checkbox-group>
            </div>

        </div>-->

     <!--<div class="more">

        </div>-->
        <!--告警其他筛选条件-->
       <div class="sl-v-list" v-show="more" >
            <span class="title">主对象名称：</span>
            <el-input v-model="input_object_name" placeholder="请输入内容" class="text-width"></el-input>
             <span  class="title" style="margin-left: 8px;">告警区域：</span>
            <el-input v-model="input_cobject_name" placeholder="请输入内容"  class="text-width"></el-input>
                <span  class="title" style="margin-left: 8px;">告警内容：</span>
            <el-input v-model="input_content" placeholder="请输入内容"  class="text-width"></el-input>

              <span  class="more" style="margin-left: 10px;margin-top: 4px;color:#4066F7;" @click="more=false" >收起</span>
        </div>

        <!--告警级别-->
        <div class="sl-v-list">
            <span class="left title" >告警级别：</span>
            <ul  class="left ul_nav">
                <li :class="prioritychecked.viewchecked ? 'class-a' : 'class-b' " @click="selectedPriority(0)">全部</li>
                <li v-for="(item,index) in prioritData" :class="item.viewchecked ? 'class-a' : 'class-b' " :key="index" @click="selectedPriority(item.priority_id)">{{item.name}}</li>
            </ul>


        </div>
        <!--告警类型-->
        <div class="sl-v-list" v-for="(item,index) in typeData" :key="index">
            <span class="left title" >{{item.type_name}}：</span>
            <ul  class="left ul_nav">
                <li :class="item.viewchecked ? 'class-a' : 'class-b' " @click="selectedType(item,null)" >全部</li>
                <li v-for="(type,key) in item.children" :key="key" :class="type.viewchecked ? 'class-a' : 'class-b' "
                @click="selectedType(item,type)">{{type.type_name}}</li>
            </ul>
        </div>




        <!--按钮-->
        <div style="float: right;margin-right: 20px;margin-top:20px;margin-bottom: 10px;">
            <el-button type="info" plain v-on:click="exportToExcel" :loading="downloadLoading">导出数据</el-button>
            <!--<el-button type="info" plain>使用筛选</el-button>
            <el-button type="info" plain>取消筛选</el-button>-->
        </div>
        <!--table-->
        <div class="div-table">
            <el-table
                :data="tableData"
                :header-cell-style="headercellstyle"
                :max-height="tableheight"
                 >
                <el-table-column
                    prop="alarmid"
                    width="150"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="objectid"
                    label="主对象编号">
                </el-table-column>
                <el-table-column
                    prop="categoryname"
                    label="告警大类">
                </el-table-column>
                <el-table-column
                    prop="typename"
                    label="告警类型">
                </el-table-column>
                <el-table-column
                    prop="reasonname"
                    label="告警原因">
                </el-table-column>
                <el-table-column
                    prop="timestamp"
                    label="告警时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="objectname"
                    label="主对象名称">
                </el-table-column>
                <el-table-column
                    prop="cobjectname"
                    label="告警区域">
                </el-table-column>
                <el-table-column
                    prop="alarmvalue"
                    label="告警值">
                </el-table-column>
                <el-table-column
                    prop="priorityname"
                    label="告警级别">
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="告警内容"
                    width="350">
                </el-table-column>
                <el-table-column
                    prop="note"
                    label="注释内容">
                </el-table-column>
                <el-table-column
                    prop="confirmuser"
                    label="确认人员">
                </el-table-column>
                <el-table-column
                    prop="acktime"
                    label="确认时间">
                </el-table-column>
                <el-table-column
                    prop="deleteuser"
                    label="删除人员">
                </el-table-column>
                <el-table-column
                    prop="deltime"
                    label="删除时间">
                </el-table-column>
            </el-table>
               <!--分页-->
                    <div class="block" style="float: right;margin-top: 20px;margin-bottom: 20px;">
                        <span class="demonstration"></span>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentpage"
                            :page-sizes="pagesizes"
                            :page-size="pagesize"
                            layout="total,sizes, prev, pager, next, jumper"
                            :total="totalcount">
                        </el-pagination>
                    </div>
        </div>
    </div>
</template>

<script>
    const cityOptions = ['上海', '北京', '广州', '深圳'];
    export default {
        data: function () {
            return {
                tableheight:500,  //table的高度
                downloadLoading:false,
                valuetime:'',  //时间
                startTime:'', //开始时间
                endTime:'',   //结束时间
                typeData:[],  //告警类型
                prioritData:[], //告警级别
//                typeData:[
//                    {
//                        type_id:'1',
//                        type_name:'遥测',
//                        ischecked:false,
//                        viewchecked:false,
//                        children:[
//                            {
//                                type_id:'1.1',
//                                type_name:'遥测越限',
//                                ischecked:false,
//                                viewchecked:false,
//                            },
//                             {
//                                type_id:'1.2',
//                                type_name:'遥测越限2',
//                                ischecked:false,
//                                viewchecked:false,
//                            }
//                        ]
//                    },
//                     {
//                        type_id:'2',
//                        type_name:'SOE',
//                        ischecked:false,
//                        viewchecked:false,
//                        children:[
//                            {
//                                type_id:'2.1',
//                                type_name:'越限',
//                                ischecked:false,
//                                viewchecked:false,
//                            },
//                             {
//                                type_id:'2.2',
//                                type_name:'越限2',
//                                ischecked:false,
//                                viewchecked:false,
//                            }
//                        ]
//                    }
//                ],  //告警类型
//                prioritData:[
//                    // {priority_id:'0',name:"全部",ischecked:false,},
//                    {priority_id:'1',name:"一级",ischecked:false,viewchecked:false,},
//                    {priority_id:'2',name:"二级",ischecked:false,viewchecked:false,},
//                    {priority_id:'3',name:"三级",ischecked:false,viewchecked:false,},
//                ], //告警级别

                tableData:[],
//                tableData: [
//                    {
//                    date: '2016-05-02',
//                    name: '王小虎',
//                    address: '上海市普陀区金沙江路 1518 弄'
//                }, {
//                    date: '2016-05-04',
//                    name: '王小虎',
//                    address: '上海市普陀区金沙江路 1517 弄'
//                }, {
//                    date: '2016-05-01',
//                    name: '王小虎',
//                    address: '上海市普陀区金沙江路 1519 弄'
//                }, {
//                    date: '2016-05-03',
//                    name: '王小虎',
//                    address: '上海市普陀区金沙江路 1516 弄'
//                }],
                // checkAll: false,
                // checkedCities: ['上海', '北京'],
                // cities: cityOptions,
                // isIndeterminate: true,

                prioritychecked:{
                    ischecked: false,
                    viewchecked:false,
                },
                checkedType:[],  //选中的告警类型集合
                input_object_name:'',   //主对象名称
                input_cobject_name:'', //告警区域
                input_content:'',   //告警内容
                more:false,
                viewtableData:[],  //显示的 table数据
                /*分页*/
                pagesizes: [50, 100, 200, 500],
                pagesize: 50,  //一页显示多少个
                totalcount: 0,    //总共有多少条数据
                currentpage: 1, //当前选中的第几页


            }
        },
        mounted() {
            let that = this;
            //设置起始时间
            var starttime=new Date(new Date(new Date().toLocaleDateString()).getTime());
            var endtime=new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
            that.startTime=starttime;
            that.endTime=endtime;

            //获取告警类型和级别
            that.get_alarm_priority();
            that.get_alarm_type();


        //    var aa= that.toTree1(that.testData.data,0);
        //    console.log(aa);
            // that.selectedPriority(0);
            // for(var item of that.typeData){
            //     that.selectedType(item,null);
            // }

        },
        methods: {
            headercellstyle({row, column, rowIndex, columnIndex}) {
                return "background:#F7F8FA;font-weight: bold;color: #101010;";
            },
            handleCheckAllChange(val) {
                this.checkedCities = val ? cityOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            //根据条件删选查询
            selected(){
               let that=this;
               var priority=that.getcheckedPriority();
               var alarm_type=that.getcheckedTypes();

            //时间
            var begin_time=Date.parse(that.startTime);
            var end_time=Date.parse(that.endTime);

            var begintime=begin_time/1000;
            var endtime=end_time/1000;

            //其他条件
             var filter=[];
            var  object_name= that.input_object_name;
            var  cobject_name=  that.input_cobject_name;
            var  content= that.input_content;
            if(object_name){
                var item={};
                item.name="object_name";
                item.value=object_name;
                filter.push(item);
            }
             if(cobject_name){
                var item={};
                item.name="cobject_name";
                item.value=cobject_name;
                filter.push(item);
            }
             if(content){
                var item={};
                item.name="content";
                item.value=content;
                filter.push(item);
            }
             that.get_data_func(begintime,endtime,priority,alarm_type,filter);
            },
            //选中告警级别
            selectedPriority(id){
                let that = this;
                if(id==0){
                    that.prioritychecked.ischecked=!that.prioritychecked.ischecked;
                     that.prioritychecked.viewchecked=!that.prioritychecked.viewchecked;
                    if(that.prioritychecked.ischecked){
                         //当全部选中的话
                         for (var i in that.prioritData) {
                              that.prioritData[i].viewchecked=false;
                               that.prioritData[i].ischecked=true;
                          }
                    }
                }
                else{
                    var n=0;
                    for (var index in that.prioritData) {
                        if (id == that.prioritData[index].priority_id) {
                        that.prioritData[index].viewchecked = !that.prioritData[index].viewchecked;
                        //  that.prioritData[index].ischecked = !that.prioritData[index].ischecked;
                        }
                        if(that.prioritData[index].viewchecked){
                            that.prioritData[index].ischecked =true;
                            // that.prioritychecked.ischecked=false;
                             that.prioritychecked.viewchecked=false;
                            n++;
                        }
                    }
                    if(n==that.prioritData.length){
                        //当全部选中的话
                         that.prioritychecked.ischecked=true;
                         that.prioritychecked.viewchecked=true;
                          for (var i in that.prioritData) {
                            //   that.prioritData[i].ischecked=true;
                              that.prioritData[i].viewchecked=false;
                          }

                    }
                }

            },
            //选中告警类型
            selectedType(item,type){
               let that = this;
               for(var index in that.typeData){
                    if(that.typeData[index].type_id==item.type_id){
                        if(!type){
                            //选中的是全部
                            that.typeData[index].ischecked= ! that.typeData[index].ischecked;
                             that.typeData[index].viewchecked= ! that.typeData[index].viewchecked;
                             if(that.typeData[index].ischecked){
                                 for(var i in that.typeData[index].children){
                                       that.typeData[index].children[i].ischecked=true;
                                       that.typeData[index].children[i].viewchecked=false;
                                 }
                             }
                        }
                        else{
                            var n=0;
                             for(var i in that.typeData[index].children){
                                 if(type.type_id==that.typeData[index].children[i].type_id){
                                     //选中其他的
                                    that.typeData[index].children[i].viewchecked= ! that.typeData[index].children[i].viewchecked;

                                 }
                                 if(that.typeData[index].children[i].viewchecked){
                                      that.typeData[index].children[i].ischecked=true;
                                    //    that.typeData[index].children[i].ischecked= ! that.typeData[index].children[i].ischecked;
                                     n++;
                                 }

                             }
                              if(n==that.typeData[index].children.length){
                                //当全部选中的话
                                that.typeData[index].ischecked=true;
                                that.typeData[index].viewchecked=true;
                                 for(var i in that.typeData[index].children){
                                    that.typeData[index].children[i].viewchecked=false;
                               }

                            }
                        }
                    }
               }

              },

            //获取告警级别(调用服务)
            get_alarm_priority(){
                let that = this;
                that.$http
                    .get(that.BASE_INFO.ALARM_URL+"/getAlarmPriority")  //{"type": "get_alarm_priority"}
                    .then(function (response) {
                         if(response && response.data && response.data.result && response.data.result.data){
                             var data=response.data.result.data;
                             var result=[];
                             for(var item of data){
                                 var da={};
                                 da=item;
                                 da.ischecked=false;
                                 da.viewchecked=false;
                                 result.push(da);
                             }
                             that.prioritData=result;
                             //默认选中全部
                             that.selectedPriority(0);
                         }
                    });
            },
            //获取告警类型(调用服务)
            get_alarm_type(){
                let that = this;
                that.$http
                    .get(that.BASE_INFO.ALARM_URL+"/getAlarmType")  //{"type": "get_alarm_type"}
                    .then(function (response) {
                        if(response && response.data && response.data.result && response.data.result.data){
                            var data=response.data.result.data;
                             var list= that.toTree(data,0);
                             var result=[];
                             for(var item of list){
                                 var da={};
                                 da=item;
                                 da.ischecked=false;
                                 da.viewchecked=false;
                                 var children=[];
                                 for(var type of da.children){
                                     var t=type;
                                     t.ischecked=false;
                                     t.viewchecked=false;
                                     children.push(t);
                                 }
                                 result.push(da);

                             }
                             that.typeData=result;
                             if(result){
                                 for(var type of result){
                                       that.selectedType(type,null);
                                 }
                             }
                            // that.typeData=data;
                        }
                    });
            },

            //获取选中的告警级别
            getcheckedPriority(){
                let that=this;
                var checkeds=[];
              for(var item of that.prioritData){
                  if(item.ischecked){
//                      checkeds.push({"priority_id":item.priority_id});
                      checkeds.push(item.priority_id);
                  }
              }
              return checkeds;
            },
            //获取选中的告警类型
            getcheckedTypes(){
              let that=this;
              var checkeds=[];
              for(var item of that.typeData){
                  if(item.children){
                      for(var da of item.children){
                          if(da.ischecked){
//                              checkeds.push({"type_id":da.type_id});
                               checkeds.push(da.type_id);
                          }
                      }
                  }
              }
              return checkeds;
            },

            //根据筛选条件获取数据
            get_data_func(begin_time,end_time,priority,alarm_type,filter){
                let that=this;
                 var param={
                //    "type":"get_data_func",
                   "begintime":begin_time,
                  "endtime":end_time,
                   "priority":priority,
                  "alarm_type":alarm_type,
                  "filter":filter
                };
                 that.$http
                    .post(that.BASE_INFO.ALARM_URL+"/getDataByFilter", param)
                    .then(function (response) {
                        if(response && response.data && response.data.result && response.data.result.data){
                            var data=response.data.result.data;
                            that.tableData=data;
                            that.currentpage=1;
                            that.formatTableData();
                        }
                    });
            },

            formatTableData(){
                let that=this;
                 //显示分页
                 that.totalcount = that.tableData.length;
                 var currentpage= that.currentpage;
                var begin=(currentpage-1)*that.pagesize;
                var end=(currentpage-1)*that.pagesize+that.pagesize;
                that.viewTableData(begin,end);
            },

            //显示的table数据
            viewTableData(begin,end){
                let that = this;
                let tableData = that.tableData;
                let viewtableData = [];
                    if(tableData.length < end){
                        end=tableData.length;
                    }
                    for (var index= begin;index< end ;index++) {
                        var newitem = tableData[index];
                        viewtableData.push(newitem);
                    }
                    that.viewtableData = viewtableData;
            },

            //数据转成树形结构
            toTree(data, parent_id) {
              var tree = [];
              var temp;
              for (var i = 0; i < data.length; i++) {
                if (data[i].parent_type_id == parent_id) {
                var obj = data[i];
                temp = this.toTree(data, data[i].type_id);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                tree.push(obj);
            }
             }
             return tree;
           },


              toTree1(data, parent_id) {
              var tree = [];
              for (var i = 0; i < data.length; i++) {
                 var obj = data[i];
                 var bool=false;
                 for(var index in tree){
                     if(tree[index].floor==obj.floor){
                         bool=true;
                     }
                 }
                 if(bool){
                    //存在
                    tree[index].children.push(obj);
                 }
                 else{
                     var node={};
                     node.floor=obj.floor;
                     node.children=[];
                     node.children.push(obj);
                     tree.push(node);
                 }

              }
               return tree;


           },

            //导出数据
            exportToExcel(){
                if(this.tableData.length>0){
                    this.downloadLoading = true;
                    require.ensure([], () => {
                        const { export_json_to_excel } = require('@/vendor/Export2Excel')
                        const tHeader = ['编号', '主对象编号', '告警大类','告警类型','告警原因','告警类型','告警时间','主对象名称','告警区域','告警值','告警级别','告警内容','注释内容','确认人员','确认时间','删除人员','删除时间'];
                        const filterVal = ['alarmid', 'objectid', 'categoryname',"typename","reasonname","typename","timestamp","objectname","cobjectname","alarmvalue","priorityname","content","note","confirmuser","acktime","deleteuser","deltime"];
                        const list = this.tableData;
                        const data = this.formatJson(filterVal, list);
                        export_json_to_excel(tHeader, data, '列表excel');
                        this.downloadLoading = false;
                    });
                }

            },
             /*****************************分页************************************/
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagesize=val;
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentpage = val;
                this.formatTableData();
            },
            /*****************************分页************************************/

        }

    };
</script>

<style scoped>
    .el-checkbox__input{
        display: none;
    }
    .left{
        float: left;
    }
    .divcontent{
        font-size: 13px;
    }
    .sl-v-list {overflow: hidden;
        zoom: 1;
        padding-top: 15px;
        /*border-top: 1px dashed #dedede;*/
        margin: 0 30px;}
    .ul_nav {
        display: block;
        overflow: hidden;
        white-space:nowrap;
    }
    .ul_nav li{
        list-style: none;
        display: inline-block;
        margin-left: 15px;
        cursor: pointer;
        padding-left: 3px;
        padding-right: 3px;
        padding-bottom:1px;
        /*width: 100px;*/

    }
    .class-a{
        color: #ffffff;
        background: #4066F7;

    }
    .class-b{
         color: #000000;
        background: #ffffff;

    }
    .div-table{
        margin-top:15px;
    }
    .more{
        /*float:left;*/
        cursor: pointer;

    }
    .title{
        text-align: right;
         width: 80px;
     }
     .text-width{
         width: 190px;
     }

    /*.ul_nav{*/
        /*height: 25px;*/
        /*padding: 0 15px;*/
        /*!*border-bottom: 1px solid #dddddd;*!*/
        /*position: relative;*/
        /*!*background: #f7f8f9;*!*/
    /*}*/
    /*.ul_nav li{*/
        /*padding-top: 10px;*/
        /*list-style: none;*/
        /*display: inline-block;*/
        /*margin-right: 30px;*/
        /*height: 25px;*/
        /*cursor: pointer;*/
    /*}*/
    /*.ul_nav li a{*/
        /*color: #666666;*/
    /*}*/
</style>
