<template>
    <div>
        <div>
            <el-row :gutter="6">
                <el-col :span="4">
                    <el-card shadow="hover"  style="background-color:#F5F7FA;overflow:auto;" class="tree"  v-bind:style="{height:treeheight+ 'px'}">
                        <div class="tree-wrap left">
                            <el-tree :data="treeData" @node-click="handleNodeClick"
                                     style="background-color: #F5F7FA;font-size: 12px;min-width: 200px;"
                                     node-key="id"
                                     :default-expanded-keys="idArr"
                                     :default-checked-keys="checkedkeys"
                                     highlight-current></el-tree>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="20">
                    <el-card shadow="hover">
                        <el-tabs v-model="editableTabsValue"
                                 v-show="addtabs"
                                 @tab-click="onTabClick" type="card" closable
                                 @tab-remove="removeTab">
                            <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title"
                                         :name="item.name">
                                {{item.content}}
                            </el-tab-pane>
                        </el-tabs>
                        <el-card shadow="hover" style="margin-bottom: 10px;"    v-show="addtabs">
                            <el-row style="margin-bottom: 10px;">
                                <el-button type="primary" plain @click="dialogFormVisible = true">列选择</el-button>
                                <el-button type="info" plain @click="updateTableData" >修改信息</el-button>
                                <el-input v-model="inputTime" placeholder="5" type="number" :min="1" style="width: 60px;"></el-input>
                                <el-button type="info" plain v-on:click="refresh">{{timeName}}</el-button>
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
                       </el-card>
                    <!--分页-->
                    <div class="block" style="float: right;margin-bottom: 5px;">
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
                        <!--table-->
                            <el-table :data="viewtableData" :header-cell-style="headercellstyle"
                                      @selection-change="handleSelectionChange"
                                      :max-height="tableheight"
                                      border>
                            <el-table-column  v-if="addtabs"
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column  v-if="isSCADA_Analog"
                                              lable="曲线"
                                              width="55">
                                <template slot-scope="scope">
                                    <el-button @click="handleRowClick(scope.row)" type="text" size="small">曲线</el-button>
                                </template>
                            </el-table-column>
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
                </el-col>
            </el-row>
        </div>

        <!--弹出框-->
        <el-dialog title="列选择" :visible.sync="dialogFormVisible">
            <el-transfer :titles="['所有列', '已选择']" v-model="checkvalue" :data="checkList">
            </el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmCloumns">确 定</el-button>
            </div>
        </el-dialog>

        <!--弹出框-->
        <el-dialog title="修改信息" :visible.sync="dialogUpdateVisible">
            <el-form :model="form">
                <el-form-item label="列名称" :label-width="formLabelWidth">
                    <el-select v-model="form.columnname" placeholder="请选择列名称" @change="changeformColumnName">
                        <el-option v-for="(item,index) in form.columnnameoptions" :key="item.Name" :label="item.Desc"
                                   :value="item.Name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="form.label"  :label-width="formLabelWidth">
                    <el-input v-model="form.value"  auto-complete="off" type="number"  :min="0" v-if="!isString"
                              style="width:240px; "></el-input>
                    <el-input v-model="form.value"  auto-complete="off"  v-if="isString"
                              style="width:240px; "></el-input>
                </el-form-item>
                <!--<el-form-item label="增量模式" :label-width="formLabelWidth" style="font-weight: bold">-->
                <!--</el-form-item>-->
                <el-checkbox v-model="form.checked" style="font-weight: bold" :disabled="isString" @change="changechecked">增量模式</el-checkbox>
                <el-form-item label="" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.radio" :disabled="!form.checked">
                        <el-radio :label="1">按步长增长</el-radio>
                        <el-radio :label="2">按循环增长</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" :label-width="formLabelWidth">
                    <span>步长</span>
                    <el-input v-model="form.inputstep" :disabled="!form.checked" placeholder="" style="width: 100px;" type="number" :min="0"></el-input>

                    <span>环长</span>
                    <el-input v-model="form.inputcycle" :disabled="form.radio =='1' || !form.checked" placeholder="" style="width: 100px;" type="number"  :min="0"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmUpdate">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        data() {
            const generateData2 = _ => {
                const data = [];
                const cities = ["上海", "北京", "广州", "深圳", "南京", "西安", "成都"];
                const pinyin = [
                    "shanghai",
                    "beijing",
                    "guangzhou",
                    "shenzhen",
                    "nanjing",
                    "xian",
                    "chengdu"
                ];
                cities.forEach((city, index) => {
                    data.push({
                        label: city,
                        key: index,
                        pinyin: pinyin[index]
                    });
                });
                return data;
            };
            return {
                tableheight:500,  //table的高度
                treeheight:500,  //树的高度
                columnwidth:55,   //每个列的宽度
                timeName: "刷新",   //刷新按钮显示的名称
                isrefresh: false,  //是否刷新
                refreshInterval: {},  //刷新事件
                isSCADA_Analog:false,   //是否是遥测表
                data2: generateData2(),
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
                    //            {
                    //            title: 'Tab 1',
                    //            name: '1',
                    //            content: 'Tab 1 content'
                    //        }, {
                    //            title: 'Tab 2',
                    //            name: '2',
                    //            content: 'Tab 2 content'
                    //        }
                ],
                tabIndex: 0,
                checkList: [], //复选框的集合（所有列）
                columnnameoptions: [],
                columnname: "",
                symboloptions: [
                  //  {
                 //        value: "选项1",
                 //       label: "黄金糕"
               //     }
                ],
                symbol: "",
                inputvalue: "",
                condition: "",
                inputTime: 5,
                dialogFormVisible: false,
                dialogUpdateVisible: false,
                form: {
                    columnname: "",
                    columnnameoptions: [],
                    label: '内部ID32',
                    value: '',
                    radio: '',
                    inputstep: '',
                    inputcycle: '',
                    checked:false,

                },
                formLabelWidth: "120px",
                isString: false, //是否是字符串类型（文本框是否可用）
                conditionIndex: 0, //条件的index
                conditionList: [],
                selcetCount: "30",
                /*分页*/
                pagesizes: [50, 100, 200, 500],   //
                pagesize: 50,  //一页显示多少个
                totalcount: 0,    //总共有多少条数据
                currentpage: 1, //当前选中的第几页
                idArr:[],  //默认打开的节点
                checkedkeys:[], //默认选中的节点
                tabList:[],  //点击后的左侧树列表


            };
        },
        mounted() {
            this.autoHeight();
            this.getTreeData();

        },
        methods: {
            autoHeight() {
                let  that=this;
                var height = document.body.clientHeight;
          //      that.tableheight=height-300;
                that.treeheight=height-80;
           //     that.top_height=height*0.2;
           //     that.second_height=height*0.4;
             //   that.third_height=height*0.4;

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
                that.addTab(that.editableTabsValue, data);
                that.addtabs = true;
                that.clearInput();   //清空数据

                var hearderList = [];
                var cloumns = [];
                var checklist = [];
                for (var index in data.fields) {
                    hearderList.push(data.fields[index].Desc);
                    data.fields[index].key = data.fields[index].Name;
                    data.fields[index].label = data.fields[index].Desc;
                    checklist.push(data.fields[index]);
                    data.fields[index].value = data.fields[index].Name;


                    var desc=data.fields[index].Desc;
                    var length=desc.replace(/[^\x00-\xff]/g,"01").length;
//                    var length=data.fields[index].Desc.length*15;
                    data.fields[index].minwidth=length*10;   //最小宽度
                    cloumns.push(data.fields[index]);
//         cloumns.push({"value":data.fields[index].Name,"label":data.fields[index].Desc});
                }
//      that.columns = hearderList;
                that.columns = cloumns;
                that.columnnameoptions = data.fields;
                if(that.columnnameoptions.length > 0){
                    that.columnname=that.columnnameoptions[0].Name;
                    that.changeColumnName(that.columnname);
                }
                that.checkList = checklist;   //复选框的集合
                that.checkvalue=[];



                that.initoptions(false);
                that.getTableCount();
                let filter = [];
                that.getTableData(data.path, this.pagesize,filter);

                //增加节点列表数据
                var tab={};
                tab.id=data.path;
                tab.columns=cloumns;
                var bnotadd=false;
                for( var t of that.tabList){
                    if(t.id== tab.id){
                        bnotadd= true;
                    }
                }
                if(!bnotadd){
                    that.tabList.push(tab);
                }


                //加载修改信息内容
                that.form.columnnameoptions = data.fields;
            },
            getTreeData: function () {
                let that = this;
                that.treeData = [];
                that.idArr=[];
                that.checkedkeys=[];
//                var params = {
//                    type: "get_model"
//                };
                that.$http
                    .get(that.BASE_INFO.BASE_DATA_URL+"/getModelDef")
                    .then(function (response) {
                        if (
                            response &&
                            response.data &&
                            response.data.result &&
                            response.data.result.Setting &&
                            response.data.result.Setting.database
                        ) {
                            var list = response.data.result.Setting.database;
                            var treeitem = {};
                            treeitem.label = "数据库";
                            treeitem.id=0;
                            treeitem.children = [];
                            for (var item of list) {
                                var oneitem = {};
                                oneitem = item;
                                oneitem.label = item.Alias;
                                treeitem.id=item.ID32;
                                if(that.idArr.length==0){
                                    that.idArr.push(treeitem.id);
                                }
                                if (item.table) {
                                    oneitem.children = [];
                                    for (var tab of item.table) {
                                        var twoitem = tab;
                                        twoitem.label = tab.Alias;
                                        twoitem.id=item.ID32;
                                        oneitem.children.push(twoitem);
                                        if(that.checkedkeys.length==0){
                                            that.checkedkeys.push(twoitem.id);
                                            that.handleNodeClick(twoitem);
                                        }
                                    }
                                }
                                treeitem.children.push(oneitem);
                            }
                            that.treeData.push(treeitem);
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
//                    .post(that.BASE_INFO.BASE_DEVICE_URL, params)
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
//                    "type": "query_count",
                    "tbname": that.tableName
                };
                that.$http
                    .post(that.BASE_INFO.BASE_DATA_URL+"/query_count", param)
//                    .post(that.BASE_INFO.BASE_DEVICE_URL, param)
                    .then(function (response) {
                        if (response && response.data && response.data.result) {
                            var count = parseInt(response.data.result.count);
//                            var pagesizes = [];
//                            for (var i = 0; i < count; i = (i + that.pagesize)) {
//                                if (count < (i + that.pagesize)) {
//                                    pagesizes.push(count);
//                                } else {
//                                    pagesizes.push(i + that.pagesize);
//                                }
//
//                            }
//                            that.pagesizes = pagesizes;
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
            //增加标签页
            addTab(targetName, data) {
                //          let newTabName = ++this.tabIndex + '';
                let newTabName = data.path;
                let btrue = false;
                this.editableTabs.forEach((tab, index) => {
                    if (tab.name === newTabName) {
                        btrue = true;
                    }
                });
                if (!btrue) {
                    this.editableTabs.push({
                        title: data.label,
                        name: newTabName,
                        tabname: data.path,
                        content: ""
                    });
                    this.editableTabsValue = newTabName;
                }
            },
            //删除标签页
            removeTab(targetName) {
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                                for( var t in this.tabList){
                                    if(this.tabList[t].id==nextTab.name){
                                        this.columns=this.tabList[t].columns;
                                    }
                                    //删除原来的
                                    if(targetName==this.tabList[t].id){
                                        this.tabList.splice(t, 1);
                                    }
                                }
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                var filter = [];
                this.tableName = activeName;
                this.getTableData(activeName,this.pagesize, filter);
            },
            //切换tab触发
            onTabClick(tab) {
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName === tab.name) {
                    var tabname = tab.name;

                    for( var t of this.tabList){
                        if(t.id== tabname){
                            this.columns=t.columns;
                            this.checkList=t.columns;
                            this.checkvalue=[];

                        }
                    }

                    this.tableName = tab.name;
                    this.clearInput();   //清空数据
                    var filter = [];
                    this.getTableData(tabname,this.pagesize, filter);
                }
            },
            //清空数据
            clearInput(){
                let that=this;
//                that.columnname="";
//                that.symbol="";
//                that.inputvalue="";
                that.clearcondition();

                //重新赋值修改信息
                that.form.multipleSelection=[];
                that.form.columnnameoptions=that.cloumns;
                that.form.columnname="内部ID32";
                that.form.value="";
                that.form.checked=false;
                that.form.radio="";
                that.form.inputstep="";
                that.form.inputcycle="";

                if(that.tableName=="SCADA_Analog"){
                    that.isSCADA_Analog=true;
                }
                else {
                    that.isSCADA_Analog=false;
                }

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
            //点击增量模式
            changechecked(val) {
                if(!val){
                    this.form.radio="";
                    this.form.inputstep="";
                    this.form.inputcycle="";
                }
                else {
                    this.form.radio=1;
                }


            },
             //点击修改信息按钮
            updateTableData(){
                let that=this;
                if(that.multipleSelection.length>0){
                    that.dialogUpdateVisible=true;

                    that.form.columnname="内部ID32";
                    that.form.value="";
                    that.form.checked=false;
                    that.form.radio="";
                    that.form.inputstep="";
                    that.form.inputcycle="";
                }
                else {
                    this.$message({
                        message: '请至少选择一行数据进行修改！',
                        type: 'warning'
                    });

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
//                                var desc=tableData[index][va].length;
//                                var length=desc.replace(/[^\x00-\xff]/g, '01').length*10;
//                                for(var cl in viewcolumns){
//                                    if(viewcolumns[cl].value==va){
//                                        if(length > viewcolumns[cl].minwidth){
//                                            viewcolumns[cl].minwidth=length;
//                                        }
//                                    }
//                                }
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
            //table中的曲线（跳转页面）
            handleRowClick(row){
//                let routeData = this.$router.resolve({
//                    path: '/archivedata',
//                    name: 'archivedata',
//                    params: {
//                        id: row.ID32,
//                        tablename:this.tableName,
//                    }
//                });
//                window.open(routeData.href, '_blank');
                var params={
                        id: row.ID32,
                        tablename:this.tableName,
                    }
                let routeData = this.$router.resolve({
                    name: "archivedata",
                    query: params,
                    params:{id:params.id,tablename:this.tableName,}
                });
                window.open(routeData.href, '_blank');
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
            //点击修改信息确定按钮触发事件
            confirmUpdate(){
                let that = this;
                let columns = that.columns;
                let form = that.form;  //修改信息页面信息
                let selectlist = that.multipleSelection;  //选择的数据
                let options = that.form.columnnameoptions;   //列的信息
                let columnname = form.columnname; //列名称
                let value = form.value;   //列值
                let radio = form.radio;   // 选择的是步长还是环长
                let inputstep = form.inputstep;   //步长
                let inputcycle = form.inputcycle;   //环长

                let records = [];
                let n = 0;  //
                for (var index in that.multipleSelection) {
                    var updateColumn = {};
                    updateColumn.id = that.multipleSelection[index].ID32;   //唯一id
//                    updateColumn.data = [];
                    updateColumn.field=[];
                    updateColumn.field.push(columnname);

                    var updvalue="";
                    if (radio == "1") {
                        //选择步长
                        var input=0;
                        if(inputstep){
                           input=parseInt(index * inputstep);
                        }
                        updvalue = (parseFloat(value) + input) + "";
                    } else if(radio == "2"){
                        var input=0;
                        if(inputstep && inputcycle){
                            input=parseInt(n * inputstep);
                        }
                        var v1=parseFloat(value) + input;
                        if(n >= parseInt(inputcycle)){
                            n=0;
                            input=parseInt(n * inputstep)
                        }
                        updvalue = (parseFloat(value) + input )+ "";
                    }else {
                        updvalue=value;
                    }
                    updateColumn.value=[];
                    updateColumn.value.push(updvalue);
                    n++;
                    records.push(updateColumn);
                }
                that.updateTablemodel(that.tableName, records);
                that.dialogUpdateVisible = false;


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
            getTreeData1() {
                let that = this;

                that.$http
                    .post(that.BASE_INFO.BASE_DEVICE_URL, {type: "get_model"})
                    .then(function (response) {
                        console.dir(response);
                    });
            }
        },
        components: {}
    };
</script>

<style>
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

    .el-dialog {
        width: 40%;
    }

    .el-form-item__label {
        text-align: left;
        margin-left: 20px;;

    }

</style>
