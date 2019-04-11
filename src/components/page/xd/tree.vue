<template>
    <div class="tree-wrap left " >
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="遥测" name="SCADA_Analog"></el-tab-pane>
            <el-tab-pane label="遥信" name="SCADA_Digit"></el-tab-pane>
            <el-tab-pane label="电度" name="SCADA_Pulse"></el-tab-pane>
        </el-tabs>
        <div style="margin-top: 15px;">
            <el-input placeholder="查找" v-model="inputText" class="input-with-select">
                <el-select v-model="selectType" slot="prepend" placeholder="请选择" style="width: 80px;">
                    <el-option label="名称" value="strName"></el-option>
                    <el-option label="ID" value="ID32"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" v-on:click="search"></el-button>
            </el-input>
        </div>
        <div class="tree" v-bind:style="{height:treeheight+ 'px'}">
        <el-tree :data="treeData" @node-click="handleNodeClick"
                 node-key="number"
                 style="background-color: #F5F5F7;"
                 :default-expanded-keys="idArr"
                 :default-checked-keys="checkedkeys"
                 highlight-current
                 ref="mytree">
               <span class="custom-tree-node" slot-scope="{ node, treeData }"  :title="node.label">
                   <span class="span-img" ></span>
                       <span>{{ node.label }}</span>
                   </span>
        </el-tree>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                treeheight:500,  //树的高度
                activeName:'SCADA_Analog',
                treeData: [
                    {
                        label:'厂站',
                        children: []
                }

                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tables:[],
                inputText:'',
                columns:[],
                selectType:'strName',
                expandedkeys:'',   //默认打开的节点
                idArr:[],  //默认打开的节点
                checkedkeys:[], //默认选中的节点
                isAll:false,  //是否显示全部
            }
        },
        created(){

        },
        mounted(){
            let that=this;
            that.autoHeight();
//            that.getTreeData();
//            if(that.realtimeID){
//                console.log(that.realtimeID);
//
//                that.inputText=that.realtimeID;
//                that.activeName= that.realtimeTablename;
//                that.selectType="ID32";
//                that.search();
//            }else {
//                that.getTreeData();
//            }

        },

        methods:{
            autoHeight() {
                let  that=this;
                var height = document.body.clientHeight;
//                that.tableheight=height-300;
                that.treeheight=height-200;
            },
            setparentData(id,name){
               let that=this;
               if(id) {
                that.inputText = id;
                that.activeName = name;
                that.selectType = "ID32";
//                that.search();
                   that.getTreeData('');
               }
            },
            //是否显示全部内容
            setparentIsAll(){
                let that=this;
                that.isAll=true;
                that.getTreeData('');

            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{name: 'region1'}, {name: 'region2'}]);
                }
                if (node.level > 3) return resolve([]);

                var hasChild;
                if (node.data.name === 'region1') {
                    hasChild = true;
                } else if (node.data.name === 'region2') {
                    hasChild = false;
                } else {
                    hasChild = Math.random() > 0.5;
                }
            },
            handleNodeClick: function (data) {
                let that = this;
                that.$refs.mytree.setCurrentKey(data.number);
//                this.$refs.mytree.setCurrentNode(data);

                var checkdata={};
                checkdata.id=data.id;
                var tablename='';
                switch (this.activeName){
                    case 'SCADA_Analog':
                        tablename="hdr_analog";
                        break;
                    case 'SCADA_Digit':
                        tablename="hdr_digit";
                        break;
                }
                checkdata.tablename=tablename;
                checkdata.label=data.label;
                checkdata.cloumns=that.cloumns;
                this.$emit("childByID", checkdata);
            },
            //查询
            search(){
                let that=this;
                var inputText= that.inputText;
                var tablename= that.activeName;
                var filter=[];
                var item = {};
                item.value =inputText;
                item.name =that.selectType;
                if(that.selectType=="strName"){
                    item.method = "contains";
                }
                else {
                    item.method = "==";
                }
                filter.push(item);
                if(inputText !=""){
//                    that.getRecordByIndexfilter(tablename,0,0,filter);
                    that.getTreeData(item);
                }
                else {
                    that.getTreeData('');
                }



            },
            handleClick(val){
                let that=this;
                that.getTreeData();

            },
            //获取厂站信息
            getTreeData: function (filter) {
                let that = this;
                let searchFilter =  filter;
                that.treeData = [];
                that.idArr=[];
                that.checkedkeys=[];
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
                            // var list = response.data.result.Setting.database;
                            // var treeitem = {};
                            // treeitem.label = "数据库";
                            // treeitem.id=0;
                            // treeitem.children = [];
                            // for (var item of list) {
                            //     var oneitem = {};
                            //     oneitem = item;
                            //     oneitem.label = item.Alias;
                            //     treeitem.id=item.ID32;
                            //     if(that.idArr.length==0){
                            //         that.idArr.push(treeitem.id);
                            //     }
                            //     if (item.table) {
                            //         oneitem.children = [];
                            //         for (var tab of item.table) {
                            //             var twoitem = tab;
                            //             twoitem.label = tab.Alias;
                            //             twoitem.id=item.ID32;
                            //             oneitem.children.push(twoitem);
                            //             if(that.checkedkeys.length==0){
                            //                 that.checkedkeys.push(twoitem.id);
                            //                 that.handleNodeClick(twoitem);
                            //             }
                            //         }
                            //     }
                            //     treeitem.children.push(oneitem);
                            // }

                            // that.treeData.push(treeitem);

                            var list = response.data.result.Setting.database;
                            var treeitem = {};
                            treeitem.label = "厂站";
                            treeitem.number = 0;
                            treeitem.children = [];
                            for (var item of list) {
//                                var oneitem = {};
//                                oneitem = item;
//                                oneitem.label = item.strDescr;
//                                oneitem.id=item.ID32;
//                                treeitem.children.push(oneitem);
                                  that.getTreeNodeData(that.activeName,item.ID,item,treeitem,that.treeData,that.idArr,that.checkedkeys,searchFilter);
//                                that.treeData.push(treeitem);
//                                }
                            }
//                            else {
//                                var inputText= that.inputText;
//                                var tablename= that.activeName;
//                                var filter=[];
//                                var item = {};
//                                item.value =inputText;
//                                item.name =that.selectType;
//                                if(that.selectType=="strName"){
//                                    item.method = "contains";
//                                }
//                                else {
//                                    item.method = "==";
//                                }
//                                filter.push(item);
//                                that.getRecordByIndexfilter(that.activeName,0,0,filter);
//                            }


                        }
                    });
            },
            //获取厂站下表中数据
            getTreeNodeData:function (tablename,value,oneitem,treeitem,treeData,idArr,checkedkeys,searchFilter) {
                var newitem = {};
                newitem = oneitem;
                newitem.label = oneitem.strDescr;
                newitem.number=parseInt("20000000000"+oneitem.ID32);
                if(idArr.length==0){
                    idArr.push(newitem.number);
                }

//               treeitem.children.push(newitem);

                let that = this;
                var filter=[];
                var iSiteID=value;
                var item={};
                item.name="iSiteID";
                item.method="==";
                item.value=value+"";
                filter.push(item);
                if(searchFilter){
                    filter.push(searchFilter);
                }
                var params = {
                    tbname: tablename,
                    begin: 0,
                    count: 0,
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
                                    var name = that.cloumns[j].value;
                                    var value = content[j];
                                    that.$set(item, name, value);

                                }
                                list.push(item);
                            }
                            if(list){
                                var childrenlist=[];
                                for(var da of list){
                                    var oneitem = {};
                                    oneitem = da;
                                    oneitem.label =da.ID32+"_"+ da.strName;
                                    oneitem.id=da.ID32;
                                    oneitem.number=da.ID32;
                                    childrenlist.push(oneitem);
                                    if(checkedkeys.length==0 && idArr.length>0 ){
                                        if(idArr[0]==newitem.number){
                                            checkedkeys.push(oneitem.number);
                                            that.handleNodeClick(oneitem);
                                        }

                                    }
                                }
                                newitem.children=childrenlist;
                                treeitem.children.push(newitem);
                                treeData.push(treeitem);




                            }
                        }
                    });
            },

            //调用服务获取指定条件数据
            getRecordByIndexfilter(tbname,begin,count,filter){
                let that = this;
                var params = {
                    tbname: tbname,
                    begin:begin,
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
                                    var name = that.cloumns[j].value;
                                    var value = content[j];
                                    that.$set(item, name, value);

                                }
                                list.push(item);
                            }
                            that.idArr=[];
                            that.checkedkeys=[];
                            //重新组织树结构
                            that.treeData= that.settreeData(list,that.idArr);
                            if(that.treeData){
                                for(var i in that.treeData[0].children)
                                if(that.checkedkeys.length==0 && that.idArr.length>0 ){
                                    that.checkedkeys.push(that.treeData[0].children[i].number);
                                        that.handleNodeClick(that.treeData[0].children[i]);
                                }
                            }


                        }
                    });
            },
            //重新组织树结构
            settreeData(datalist,idArr){
                var treeData=[];
                var treeitem = {};
                treeitem.label = "厂站";
                treeitem.number =0;
                treeitem.children = [];
                if(idArr.length==0){
                    idArr.push(treeitem.number);
                }
                for(var item of datalist){
                    var oneitem = {};
                    oneitem = item;
                    oneitem.label =item.ID32+"_"+ item.strName;
                    oneitem.id=item.ID32;
                    oneitem.number=item.ID32;
                    treeitem.children.push(oneitem);
                }
                treeData.push(treeitem);
                return treeData;
            },

            //
            setcolumns(tables,activeName){
                var cloumns = [];
                for(var tab of  tables){
                    if(tab.path==activeName){

                        for (var index in tab.fields) {
                            tab.fields[index].key = tab.fields[index].Name;
                            tab.fields[index].label = tab.fields[index].Desc;
                            tab.fields[index].value = tab.fields[index].Name;
                            cloumns.push(tab.fields[index]);
                        }

                    }
                }
                return   cloumns;
            },
        },
        components: {
        },
        // 接受父组件的值
        props: {
            realtimeID:String,
            realtimeTablename:String,
        },
        watch:{
            //监听双向绑定数据变化
            realtimeID:{
                handler(newValue, oldValue) {

                },
                deep:true
            }
        },

    }
</script>

<style >
.sapn-margin-left{
    margin-left: 10px;
}
/*.tree-wrap {
    padding: 0;
}

.tree-wrap .el-tree {
}

.tree-wrap
.el-tree--highlight-current
.el-tree-node.is-current
> .el-tree-node__content {
    background-color: #f5f4f7;
    color: #1567b3;
    font-weight: bold;
}


.el-tree-node__expand-icon {
    color: #76838f;
}

.el-tree-node__content {
    height: 40px;
}*/
/*.el-tree-node{
    margin-top: 3px;
    font-size: 12px;
}*/
    .span-img{
        padding-left: 25px;
        background: url("../../../assets/img/tree-icon.png") no-repeat 4px 4px;
        white-space: normal;
        width: 200px;
        overflow: auto;
    }
    .custom-tree-node{
        /*text-overflow: ellipsis;*/
        /*display: inline-block;*/
    }


</style>
