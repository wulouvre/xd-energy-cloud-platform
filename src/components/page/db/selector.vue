<template>
    <div>
        <div>
                    <el-card shadow="hover">
                        <!--<el-tabs v-model="editableTabsValue"
                                 v-show="addtabs"
                                 @tab-click="onTabClick" type="card" closable
                                 @tab-remove="removeTab">
                            <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title"
                                         :name="item.name">
                                {{item.content}}
                            </el-tab-pane>
                        </el-tabs>-->
                        <el-card shadow="hover" style="margin-bottom: 10px;"    v-show="addtabs">
                            <el-row style="margin-bottom: 10px;">
                                <!--<el-button type="primary" plain @click="dialogFormVisible = true">列选择</el-button>
                                <el-button type="info" plain @click="updateTableData" >修改信息</el-button>
                                <el-input v-model="inputTime" placeholder="5" type="number" :min="1" style="width: 60px;"></el-input>
                                <el-button type="info" plain v-on:click="refresh">{{timeName}}</el-button>-->
                            </el-row>
                            <el-row style="margin-bottom: 10px;">
                                <el-select v-model="columnname" placeholder="请选择列" @change="changeColumnName">
                                    <el-option v-for="(item,index) in columnnameoptions" :key="index" :label="item.Desc"
                                               :value="item.Name">
                                    </el-option>
                                </el-select>
                                <el-select v-model="symbol" placeholder="">
                                    <el-option v-for="item in symboloptions" :key="item.value" :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-input v-model="inputvalue" placeholder="" style="width: 200px"></el-input>
                                <!--<el-select v-model="condition" placeholder="并且">-->

                                <!--</el-select>-->
                                <el-button type="primary" v-on:click="onselectclick">查询</el-button>
                                <el-button type="info" plain v-on:click="addcondition">增加条件</el-button>
                                <el-button type="info" plain v-on:click="clearcondition">清空条件</el-button>
                            </el-row>
                            <el-row style="margin-bottom: 10px;" v-for="(con,index) in conditionList" :key="index">
                                <el-select v-model="con.columnname" placeholder="请选择列"
                                           @change="changeItemColumnName($event,index)">
                                    <el-option v-for="(item,index) in con.columnnameoptions" :key="index"
                                               :label="item.Desc" :value="item.Name">
                                    </el-option>
                                </el-select>
                                <el-select v-model="con.symbol" placeholder="等于">
                                    <el-option v-for="item in con.symboloptions" :key="item.value" :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-input v-model="con.inputvalue" placeholder="" style="width: 200px"></el-input>
                                <i class="el-icon-close"  v-on:click="deletecondition"></i>
                            </el-row>
                             <!--<el-row style="margin-bottom: 10px;float:right;">
                              
                                <el-button type="info" plain>确定</el-button>
                             
                            </el-row>-->
                       </el-card>

                        <!--table-->
                            <el-table :data="viewtableData" :header-cell-style="headercellstyle"
                                      @selection-change="handleSelectionChange"
                                      :max-height="tableheight"
                                      border>
                            <el-table-column  v-if="addtabs"
                                type="selection"
                                width="55">
                            </el-table-column>
                            <!--<el-table-column  v-if="isSCADA_Analog"
                                              lable="曲线"
                                              width="55">
                                <template slot-scope="scope">
                                    <el-button @click="handleRowClick(scope.row)" type="text" size="small">曲线</el-button>
                                </template>
                            </el-table-column>-->
                            <el-table-column :label="item.label" :prop="item.value" v-for="(item, key) in viewcolumns"
                                             :min-width="item.minwidth"
                                             :key="key" >
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
                    </el-card>
        </div>

     



    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableheight:500,  //table的高度
                columnwidth:55,   //每个列的宽度
                timeName: "刷新",   //刷新按钮显示的名称
                isrefresh: false,  //是否刷新
                refreshInterval: {},  //刷新事件
                isSCADA_Analog:false,   //是否是遥测表
                checkvalue: [],
                addtabs: false, //是否点击某个节点
                tableName: "", //当前表名
                treeData: [],
                columns: ["A", "B", "C"],
                tableData: [[1, 2, 3], [4, 5, 6]],
                viewcolumns: [],  //显示的列
                viewtableData: [], //根据列显示的数据
                multipleSelection: [],  //table选中的行列表
                editableTabsValue: "0",
                editableTabs: [
            
                ],
                tabIndex: 0,
                checkList: [], //复选框的集合（所有列）
                columnnameoptions: [],
                columnname: "",
                symboloptions: [
                ],
                symbol: "",
                inputvalue: "",
                condition: "",
                isString: false, //是否是字符串类型（文本框是否可用）
                conditionIndex: 0, //条件的index
                conditionList: [],
                selcetCount: "30",
                /*分页*/
                pagesizes: [50, 100, 200, 500],   //
                pagesize: 50,  //一页显示多少个
                totalcount: 0,    //总共有多少条数据
                currentpage: 1, //当前选中的第几页
                tabList:[],  //点击后的左侧树列表
                tagname:'SCADA_Analog',  //外部传来的表名


            };
        },
        mounted() {
            this.getTreeData();

        },
        methods: {
            //外部选择打开
            openPointSelector(tagname){
              that.tagname=tagname;
              this.getTreeData();
            },

            //外部调用选择的测点方法
            getPoints(){
               let that=this;
               var result=[];
                if(that.multipleSelection.length>0){
                  for(var item of that.multipleSelection){
                      result.push(item.ID32);
                  }
                }
                else {
                    this.$message({
                        message: '请至少选择一个测点！',
                        type: 'warning'
                    });

                }
                return result;
            },


            headercellstyle({row, column, rowIndex, columnIndex}) {
                return "background:#E4E7EB;font-weight: bold;color: #101010;";
            },
            //点击树触发事件
            handleNodeClick: function (data) {
                let that = this;
                if(data.children){
                    return;
                }
                that.tableName = data.path;    //table表名
                // that.addTab(that.editableTabsValue, data);
                that.addtabs = true;
                that.clearInput();   //清空数据

                var hearderList = [];
                var cloumns = [];
                // var checklist = [];
                for (var index in data.fields) {
                    hearderList.push(data.fields[index].Desc);
                    data.fields[index].key = data.fields[index].Name;
                    data.fields[index].label = data.fields[index].Desc;
                    // checklist.push(data.fields[index]);
                    data.fields[index].value = data.fields[index].Name;


                    var desc=data.fields[index].Desc;
                    var length=desc.replace(/[^\x00-\xff]/g,"01").length;
                    data.fields[index].minwidth=length*10;   //最小宽度
                    cloumns.push(data.fields[index]);
                }
                that.columns = cloumns;
                that.columnnameoptions = data.fields;
                if(that.columnnameoptions.length > 0){
                    that.columnname=that.columnnameoptions[0].Name;
                    that.changeColumnName(that.columnname);
                }
                // that.checkList = checklist;   //复选框的集合
                that.checkvalue=[];
                that.initoptions(false);
                that.getTableCount();
                let filter = [];
                that.getTableData(data.path, this.pagesize,filter);
            },
            getTreeData: function () {
                let that = this;
                var params={
                 "tbname": that.tagname
                };
                that.$http
                    .post(that.BASE_INFO.BASE_DATA_URL+"/getTableModel",params)
                    .then(function (response) {
                        if (
                            response &&
                            response.data &&
                            response.data.result 
                        ) {
                            var item = response.data.result;
                             if(item){
                               //根据传入的表名获取表结构
                                var twoitem = item;
                                twoitem.label = item.Alias;
                                twoitem.id=item.ID32;
                                that.handleNodeClick(twoitem);
                                 }

                          
                    
                        }
                    });
            },
            getTableData: function (tablename,count, filter) {
                let that = this;
                var filters=filter;
                var params = {
//                    type: "query_by_filter",
                    tbname: tablename,
                    begin: ((that.currentpage - 1) * that.pagesize),
                    count: count,
                    filter: filter
                };
                that.$http
                    .post(that.BASE_INFO.BASE_DATA_URL+"/getRecordByIndexfilter", params)
                    .then(function (response) {
                        if (response && response.data   && response.data.result && response.data.result.data) {
                            var list = [];
                            var data = response.data.result.data;
                            for (var i in data) {
                                var item = {};
                                var content = data[i].record.split(",");
                                for (var j in content) {
                                    var name = that.columns[j].value;
                                    var value = content[j];
                                    that.$set(item, name, value);

                                }
                                list.push(item);
                            }
                            that.tableData = list;

                            //显示分页
                            var begin=0;
                            var end=that.pagesize;
                            if(filters.length>0){
                                //有条件查询
                                that.totalcount = that.tableData.length;
//                                that.currentpage = 1;
                                var currentpage= that.currentpage;
                                 begin=(currentpage-1)*that.pagesize;
                                 end=(currentpage-1)*that.pagesize+that.pagesize;

                            }
                            that.viewCloumns(begin,end);  //显示所显示的列数据



                        } else {
                            that.tableData = [];
                            that.viewtableData =[];
                        }
                    });
            },
            //获取总条数
            getTableCount(){
                let that = this;
                var param = {
                    "tbname": that.tableName
                };
                that.$http
                    .post(that.BASE_INFO.BASE_DATA_URL+"/query_count", param)
                    .then(function (response) {
                        if (response && response.data && response.data.result) {
                            var count = parseInt(response.data.result.count);
                            that.totalcount = count;
                            that.currentpage = 1;
                        }
                    });
            },
            //加载options
            initoptions(isstring) {
                let that = this;
                var options = [];
                if (isstring) {
                    options.push({value: "==", label: "等于"});
                    options.push({value: "contains", label: "包含"});
                    options.push({value: "not_contains", label: "不包含"});
                    options.push({value: "begin_with", label: "以…为开头"});
                    options.push({value: "end_with", label: "以…结束"});
                } else {
                    options.push({value: "==", label: "等于"});
                    options.push({value: "<>", label: "不等于"});
                    options.push({value: ">", label: "大于"});
                    options.push({value: "<", label: "小于"});
                    options.push({value: ">=", label: "大于等于"});
                    options.push({value: "<=", label: "小于等于"});
                }
                return options;
            },
            //清空数据
            clearInput(){
                let that=this;
                that.clearcondition();
            },
            //点击下拉列表框触发事件
            changeColumnName(val) {
                let btrue = false;
                if (this.columnnameoptions) {
                    for (var item of this.columnnameoptions) {
                        if (item.Name == val && item.DataType === "STRING") {
                            btrue = true;
                        }
                    }
                }
                this.symboloptions = this.initoptions(btrue);
                if(this.symboloptions){
                    this.symbol=this.symboloptions[0].value;
                }

            },
            //点击下拉列表框触发事件
            changeItemColumnName(val, index) {
                let that = this;

                if (that.conditionList) {
                    var item = that.conditionList[index];
                    let btrue = false;
                    if (item.columnnameoptions) {
                        for (var col of item.columnnameoptions) {
                            if (col.Name == val && col.DataType === "STRING") {
                                btrue = true;
                            }
                        }
                    }
                    that.conditionList[index].symboloptions = [];
                    that.conditionList[index].symboloptions = this.initoptions(btrue);
                    if(that.conditionList[index].symboloptions){
                        that.conditionList[index].symbol=that.conditionList[index].symboloptions[0].value;
                    }
                }
            },
            //根据条件查询数据
            onselectclick() {
                let that = this;
                let selectcondition = [];
                let name = that.columnname;
                let symbol = that.symbol;
                let inputvalue = that.inputvalue;
                if(name !="" || inputvalue !=""){
                    let item = {};
                    item.name = name;
                    item.value = inputvalue;
                    item.method = symbol;
                    if(inputvalue){
                        selectcondition.push(item);
                    }

                }
                    if (that.conditionList) {
                        for (var con of that.conditionList) {
                            if(name !="" || inputvalue !=""){
                                let item = {};
                                item.name = con.columnname;
                                item.value = con.inputvalue;
                                item.method = con.symbol;
                                if(item.value){
                                    selectcondition.push(item);
                                }
                            }
                        }
                    }
                    let count=0;
                    if(selectcondition.length==0){
                        count=this.pagesize;
                        that.getTableCount();
                    }
                    that.getTableData(this.tableName, count,selectcondition);


            },
            //增加条件
            addcondition() {
                let that = this;
                let newIndex = ++that.conditionIndex + "";
                let item = {};
                item.id = newIndex;
                item.columnname = "";
                item.columnnameoptions = that.columnnameoptions;
                item.symboloptions = that.symboloptions;
                item.symbol = "";
                item.inputvalue = "";
                item.condition = "";
                that.conditionList.push(item);
            },
            //清空条件
            clearcondition() {
                let that = this;
                that.columnname="";
                that.symbol="";
                that.inputvalue="";
                if (that.conditionList) {
                    that.conditionList = [];
                }
            },
            //删除条件
            deletecondition(index) {
                let that = this;
                if (that.conditionList) {
                    that.conditionList.splice(index, 1);
                }
            },
            //列选择确定事件
            confirmCloumns(){
                let that = this;
                var currentpage= that.currentpage;
                var begin=(currentpage-1)*that.pagesize;
                var end=(currentpage-1)*that.pagesize+that.pagesize;
                that.viewCloumns(begin,end);  //显示所显示的列数据
                that.dialogFormVisible = false;
            },
            //根据指定列显示数据
            viewCloumns(begin,end){
                let that = this;
                let value = that.checkvalue;
                let columns = that.columns;
                let tableData = that.tableData;

                if (value.length > 0) {
                    let viewcolumns = [];
                    for (var col of columns) {
                        for (var va of value)
                            if (col.value == va) {
                                viewcolumns.push(col);
                            }
                    }
                    let viewtableData = [];
                    if(tableData.length < end){
                        end=tableData.length;
                    }
                    for (var index= begin;index < end;index++) {
                        var newitem = {};
                        for (var va of value) {
                            if (tableData[index].hasOwnProperty(va)) {
                                that.$set(newitem, va, tableData[index][va]);
                                //设置宽度
                                var desc=tableData[index][va].length;
                                var length=desc.replace(/[^\x00-\xff]/g, '01').length*10;
                                for(var cl in viewcolumns){
                                    if(viewcolumns[cl].value==va){
                                        if(length > viewcolumns[cl].minwidth){
                                            viewcolumns[cl].minwidth=length;
                                        }
                                    }
                                }
                            }

                        }

                        viewtableData.push(newitem);
                    }

                    that.viewcolumns = viewcolumns;
                    that.viewtableData = viewtableData;
                }
                else {

                    let viewtableData = [];
                    if(tableData.length < end){
                        end=tableData.length;
                    }
                    for (var index= begin;index< end ;index++) {
                        var newitem = tableData[index];
                        //设置宽度
                        for(var cl in columns){
                            var desc=newitem[columns[cl].value];
                            var length=desc.replace(/[^\x00-\xff]/g, '01').length*10;
//                            var length=newitem[columns[cl].value].length*15;
                                if(length > columns[cl].minwidth) {
                                    columns[cl].minwidth = length;
                                }
//                                }else{
//                                    columns[cl].minwidth= columns[cl].minwidth;
//                                }

                        }
                        viewtableData.push(newitem);
                    }
                    that.viewcolumns = columns;
                    that.viewtableData = viewtableData;
                }


            },
            //taable选中的行
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //点击修改信息中的下拉列表框触发事件
            changeformColumnName(val){
                let that = this;
                let btrue = false;
                if (that.form.columnnameoptions) {
                    for (var col of that.form.columnnameoptions) {
                        if (col.Name == val) {
                            that.form.label = col.Desc;
                            if (col.DataType == "INT" || col.DataType == "FLOAT") {
                                that.isString = false;
                            }
                            else {
                                that.isString = true;
                            }
                        }
                    }
                }

            },
            updateTablemodel(tablename, records){
                let that = this;
                var params = {
//                    "type": "update_by_table",
                    "tbname": tablename,
                    "records": records,
                };
                that.$http
                    .post(that.BASE_INFO.BASE_DATA_URL+"/updateRecordData", params)
                    .then(function (response) {
                        if (response && response.data &&  response.data.replyCode) {
                            if (response.data.replyCode.code == 0) {
                                that.onselectclick();
                            }
                        }

                    });
            },
            //刷新
            refresh(){
                let that = this;
                that.isrefresh = !that.isrefresh;
                var second = that.inputTime;    //定时的秒数
                var time = 1000 * second;
                if (that.isrefresh) {
                    that.refreshInterval = setInterval(function () {
                        that.onselectclick();

                    }, time);
                    that.timeName = "停止";
                }
                else {
                    that.refreshInterval = clearInterval(that.refreshInterval);
                    that.timeName = "刷新";
                }
            },

            /*****************************分页************************************/
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagesize=val;
                this.onselectclick();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentpage = val;
                this.onselectclick();
//                var filter = [];
//                this.getTableData(this.tableName,this.pagesize, filter);
            },
            /*****************************分页************************************/
          
        },
        components: {}
    };
</script>

<style scoped>
    /** style (注意不要设为scoped) */
    /** configurationTable和afterRenderClass都是为了标记仅这个组件内修改 */
    .configurationTable .el-table__body-wrapper {
        overflow: hidden;
    }
    .afterRenderClass {
    .el-table__body-wrapper {
        overflow: auto;
    }
    }
    .tree-wrap {
        /*width: 220px;*/
        /*height: 680px;*/
        /*background: #F5F4F7;*/
        /*border: 1px solid #DCE0E2;*/
        padding: 15px 0;
    }

    .tree-wrap .el-tree {
        /*background:#F5F4F7;*/
    }

    .tree-wrap
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
        background-color: #f5f4f7;
        color: #1567b3;
        font-weight: bold;
    }

    .el-tree-node__label {
        font-size: 12px;
        padding-left: 25px;
        background: url("../../../assets/img/tree-icon.png") no-repeat 4px 4px;
        white-space: normal;
        width: 200px;
        overflow: auto;
    }

    .el-tree-node__expand-icon {
        color: #76838f;
    }

    .el-tree-node__content {
        /*height: 100% !important;*/
        height: 40px;
    }

    /*.el-tree-node__content  .el-tree-node__label{*/
    /*background: url("../../../assets/img/icon-file.png") no-repeat 4px 4px;*/
    /*}*/
    /*.el-tree-node__children  .el-tree-node__label{*/
    /*background: url("../../../assets/img/zt-history.png") no-repeat 4px 4px;*/
    /*}*/

    .el-dialog {
        width: 40%;
    }

    .el-form-item__label {
        text-align: left;
        margin-left: 20px;;

    }
    .el-card__body {
        padding: 10px;
    }
    .tree::-webkit-scrollbar {/*滚动条整体样式*/
        width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    .tree::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        /*background: #535353;*/
        background: #A8A8A8;
    }
    .tree::-webkit-scrollbar-track {/*滚动条里面轨道*/
        /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
        -webkit-box-shadow: inset 0 0 5px rgba(245,247,250,0.2);
        border-radius: 10px;
        /*background: #EDEDED;*/
        background: #F5F7FA;

    }

    .tree-wrap
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
        background-color: #f5f4f7;
        color: #1567b3;
        font-weight: bold;
    }

</style>
