<template>

    <div>
        <div>
            <el-row :gutter="6">
                <el-col :span="0">
                    <el-card shadow="hover"  style="background-color: #F5F5F7">
                        <vtree  v-on:childByID="childByID"  :realtimeID="realtimeID"  :realtimeTablename="realtimeTablename"   ref="tree"></vtree>
                    </el-card>
                </el-col>
                <el-col :span="24">
                    
                    <!-- <el-card shadow="hover">
                        <el-tabs v-model="activeName" >
                            <el-tab-pane label="曲线" name="line"></el-tab-pane>
                            <el-tab-pane label="表格" name="table"></el-tab-pane>
                        </el-tabs>
                    </el-card> -->
                    <el-card shadow="hover">
                        <el-tabs v-model="activeName" >
                            <el-tab-pane label="曲线" name="line"></el-tab-pane>
                        </el-tabs>
                    </el-card>
                    <el-card>
                        <div  class="div-top-content" >
                            <span >类型：</span>
                            <el-select v-model="type" placeholder="" @change="" style="width: 90px;">
                                <el-option v-for="(item,index) in typeoptions" :key="index" :label="item.value"
                                           :value="item.name">
                                </el-option>
                            </el-select>

                            <span class="sapn-margin-left">采集间隔：</span>
                            <el-select v-model="interval" placeholder="" @change="" style="width: 90px;">
                                <el-option v-for="(item,index) in intervaloptions" :key="index" :label="item.value"
                                           :value="item.name">
                                </el-option>
                            </el-select>

                            <span class="sapn-margin-left">开始时间：</span>
                            <el-date-picker style="width: 190px;"
                                v-model="startTime"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>

                            <span class="sapn-margin-left">结束时间：</span>
                            <el-date-picker style="width: 190px;"
                                v-model="endTime"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>

                            <el-button type="primary"  icon="el-icon-search" v-on:click="serach">查询</el-button>
                            <el-button  type="info" plain  icon="el-icon-download" v-on:click="exportToExcel" :loading="downloadLoading">导出数据</el-button>

                        </div>
                    </el-card>
                    <el-card>
                        <!-- <div class="div-line" v-show="activeName=='line'" style="margin-top: 10px;"> -->
                        <div class="div-line" style="margin-top: 10px;">
                            <vcharts style="width: 100%;" v-bind:style="{height:chartheight+ 'px'}"  ref="mycharts"></vcharts>
                        </div>
                    </el-card>
                        
                    <!-- <el-card shadow="hover">
                        <el-tabs v-model="activeName" >
                            <el-tab-pane label="表格" name="table"></el-tab-pane>
                        </el-tabs>
                    </el-card> -->
                        
                    <el-card>
                        <!-- <div class="div-table" v-show="activeName=='table'"> -->
                        <div class="div-table">
                            <el-row>
                                <el-col :span="24"><div class="">
                                    <p  style="font-size: 12px;">{{totalText}}</p>
                                </div></el-col>
                            </el-row>

                            <el-row :gutter="20" v-show="tableName=='hdr_analog'">
                                <el-col :span="4"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalData.maxvalue}}</p>
                                    <p class="p-center">最大值</p>
                                </div></el-col>
                                <el-col :span="4"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalData.maxtime}}</p>
                                    <p class="p-center">发生时间</p>
                                </div></el-col>
                                <el-col :span="4"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalData.minvalue}}</p>
                                    <p class="p-center">最小值</p>
                                </div></el-col>
                                <el-col :span="4"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalData.mintime}}</p>
                                    <p class="p-center">发生时间</p>
                                </div></el-col>
                                <el-col :span="4"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalData.avgvalue}}</p>
                                    <p class="p-center">平均值</p>
                                </div></el-col>
                            </el-row>

                            <el-row :gutter="20" v-show="tableName=='hdr_digit'">
                                <el-col :span="3"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalDigitData.puttime}}</p>
                                    <p class="p-center">投运时间</p>
                                </div></el-col>
                                <el-col :span="3"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalDigitData.stoptime}}</p>
                                    <p class="p-center">停运时间</p>
                                </div></el-col>
                                <el-col :span="3"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalDigitData.putpercentage}}</p>
                                    <p class="p-center">投运率</p>
                                </div></el-col>
                                <el-col :span="3"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalDigitData.stoppercentage}}</p>
                                    <p class="p-center">停运率</p>
                                </div></el-col>
                                <el-col :span="3"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalDigitData.openclosecount}}</p>
                                    <p class="p-center">开合次数</p>
                                </div></el-col>
                                <el-col :span="3"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalDigitData.offcount}}</p>
                                    <p class="p-center">断开次数</p>
                                </div></el-col>
                                <el-col :span="3"><div class="grid-content bg-purple-dark">
                                    <p class="p-center bold">{{totalDigitData.oncount}}</p>
                                    <p class="p-center">闭合次数</p>
                                </div></el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="24"><div class="">
                                    <p style="font-size: 12px;">{{detailsText}}</p>
                                </div></el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="24">
                                    <div class="">
                                        <el-table
                                            :data="tableData"
                                            :header-cell-style="headercellstyle"
                                            :span-method="objectSpanMethod"
                                            border
                                            style="width: 100%">
                                            <!--<el-table-column-->
                                                <!--label="">-->
                                                <!--<template  slot-scope="scope">-->
                                                    <!--{{tableData[scope.$index][0]}}-->
                                                <!--</template>-->
                                            <!--</el-table-column>-->

                                            <el-table-column v-for="(item,key) in tablecClumns" :key="key"
                                                :label="item">
                                                <template  slot-scope="scope">
                                                    {{tableData[scope.$index][key]}}
                                                </template>
                                            </el-table-column>

                                        </el-table>
                                    </div>
                                </el-col>
                            </el-row>

                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
    import vtree from './tree.vue';
    import vcharts from './charts.vue';
    export default {
        data () {
            return {
                chartheight:300, //chart的高度
                activeName:"line",
                typeoptions:[
                    {
                        name:'year',
                        value:'年'
                    },
                    {
                        name:'month',
                        value:'月'
                    },
                    {
                        name:'day',
                        value:'日'
                    }
                    ],
                type:'day',
                intervaloptions:[
                    {
                        name:'1m',
                        number:1,
                        value:'1分钟'
                    },
                    {
                        name:'5m',
                        number:5,
                        value:'5分钟'
                    },
                    {
                        name:'15m',
                        number:15,
                        value:'15分钟'
                    },
                    {
                        name:'30m',
                        number:30,
                        value:'30分钟'
                    },
                    {
                        name:'1h',
                        number:60,
                        value:'1小时'
                    }
                ],
                interval:'5m',
                intervaltime:5,

                startTime:'',
                endTime:'',
                tableData: [],
                dialogFormVisible:false,
                columns:[],
                currentRecordID:'',  //当前选中的测点id
                tableName:'hdr_analog',       //当前选中的表名
                recordIDs:[],  //选中的测点集合
                tablecClumns:[],  //table的列集合
                totalData:
                {
                    minvalue:132,
                    mintime:"11:30",
                    maxvalue:132,
                    maxtime:"12:30",
                    avgvalue:132
                },
                totalText:'统计',
                detailsText:"详细信息",
                totalDigitData:{
                    puttime:'11:50',
                    stoptime:'13:40',
                    putpercentage:'27%',
                    stoppercentage:'30%',
                    openclosecount:'2',
                    offcount:'1',
                    oncount:'1',
                },
                downloadLoading:false,
                tableDataList:[],  //导出的数据
                realtimeID:'',  //从实时窗口传来的id
                realtimeTablename:'', //从实时窗口传来的table名称
            }
        },
        created(){

        },
        mounted(){

            let that=this;
            that.autoHeight();
            var starttime=new Date(new Date(new Date().toLocaleDateString()).getTime());
            var endtime=new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
            that.startTime=starttime;
            that.endTime=endtime;

            //tablecClumns
           that.settablecClumns();

//            tableData
            var tableData=[];
            for(var i=0;i<24;i++){
                var tab=[];
                var tab1=[];

                tab.push(i+"时");
                tab1.push(i+"时");
                for(var j in  that.tablecClumns){
                    tab.push(j);
                    tab1.push(j);
                }
                tableData.push(tab);
                tableData.push(tab1);
            }
            that.tableData=tableData;

            //move to initDataToChart()
            // that.realtimeID = this.$route.query.id;
            // that.realtimeTablename = this.$route.query.tablename;
            // if(!that.realtimeID) {
            //     this.$refs.tree.setparentIsAll();
            // }else {
            //     this.$refs.tree.setparentData(that.realtimeID,that.realtimeTablename);
            // }

            // ///
            // that.currentRecordID=that.realtimeID;

            // that.serach();

        },
        methods:{
            autoHeight() {
                let  that=this;
                var height = document.body.clientHeight;
//                that.tableheight=height-300;
                that.chartheight=height-250;
            },
            //从其他页面传来的id
            initDataToChart: function (id, tablename) {
                 let that=this;

                // that.realtimeID = this.$route.params.id;
                // that.realtimeTablename = this.$route.params.tablename;
                // this.$refs.tree.setparentData(that.realtimeID,that.realtimeTablename);

                that.realtimeID = id;
                that.realtimeTablename = tablename;
                if(!that.realtimeID) {
                    this.$refs.tree.setparentIsAll();
                }else {
                    this.$refs.tree.setparentData(that.realtimeID,that.realtimeTablename);
                }

                ///
                that.currentRecordID=that.realtimeID;

                that.serach();



            },
            headercellstyle({row, column, rowIndex, columnIndex}) {
                return "background:#D2D7DD;font-weight: bold;color: #101010;";
            },
            //合并单元格
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if(this.tableName !="hdr_analog"){
                    return;
                }
                if (columnIndex === 0) {
                    if (rowIndex % 2 === 0) {
                        return {
                            rowspan: 2,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            //taable选中的行
            handleSelectionChange(val) {

            },
            childByID(data){
                let that=this;
                if(data.id){
                    that.currentRecordID=data.id;
                    that.columns=data.columns;
                    that.tableName=data.tablename;
                    var label=data.label;
                    var date=that.startTime;
                    that.totalText=label+" "+date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate()+"日"+"统计";
                    that.detailsText=label+" "+date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate()+"日"+"详细信息";
                    if(data.tablename=="hdr_digit"){
                        that.activeName="table";
                    }
                    that.serach();
                }

            },
            //设置tablecClumns
            settablecClumns(){
                let that=this;
                var number=0;
                for(var item of that.intervaloptions){
                    if(that.interval==item.name){
                        number=item.number;
                    }
                }
                var tablecClumns=[];
                tablecClumns.push('');
                for(var i=0; i< 60; i=i+number){
                    tablecClumns.push(i+"分");
                }
                that.tablecClumns=tablecClumns;
                that.intervaltime=number;
            },
            //设置tablecClumns
            setdigittablecClumns(){
                let that=this;
                var number=0;
                for(var item of that.intervaloptions){
                    if(that.interval==item.name){
                        number=item.number;
                    }
                }
                var tablecClumns=[];
                tablecClumns.push("序号");
                tablecClumns.push("发生时间");
                tablecClumns.push("值");
                tablecClumns.push("质量码");
                that.tablecClumns=tablecClumns;
                that.intervaltime=number;
            },
            //根据时间查询数据
            serach(){

                let  that=this;

                var startdate=that.formatDate(that.startTime);
                var endtdate=that.formatDate(that.endTime);
                 var tbname= that.tableName;

                 //支持多个测点时
                //if(that.recordIDs.indexOf(parseInt(this.currentRecordID)) ==-1)
                //{
                //    that.recordIDs.push(parseInt(this.currentRecordID));
                //}
                //单个测点
                that.recordIDs=[];
                that.recordIDs.push(parseInt(this.currentRecordID));
                var ids=that.recordIDs;
                var begintime=startdate;
                var endtime=endtdate;
                var interval=that.interval;
                var mode=2;
                if(tbname=="hdr_digit"){
                    that.setdigittablecClumns();   //设置表的列
                }else {
                    that.settablecClumns();   //设置表的列
                }

                that.getValuesData(tbname,ids,begintime,endtime,interval,mode);
                that.getMinMaxData(tbname,parseInt(this.currentRecordID),begintime,endtime);

            },
            getValuesData(tbname,ids,begintime,endtime,interval,mode){
                let that = this;
                var params={
                    "tbname":tbname,
                    "id":ids,
                    "begintime":begintime,
                    "endtime":endtime,
                    "interval":interval,
                    "mode":mode
                }
                that.$http
                    .post(that.BASE_INFO.BASE_ARCH_URL+"/valuesbytmrange",params )
                    .then(function (response) {
                       if(response && response.data && response.data.result){
                           var datalist=response.data.result;
                           if(that.tableName=="hdr_digit") {
                               that.viewdigitTableData(datalist);
                               that.viewdigitTotalData(datalist,that.intervaltime);
                           }
                           else {
                               that.viewtableData(datalist,that.tablecClumns.length);
                           }
                            that.setExcelTableData(datalist);
                           that.$refs.mycharts.initDataToChart(datalist,begintime,endtime,that.intervaltime);


            }
                    });
            },
            //显示table数据
            viewtableData(data,interval){
                let that=this;
                var tableData=[];
                if(data){
                    for(var item of data){
                        if(item.data){

                            var num=0;
                            for(var i=0;i<24;i++){
                                var tab=[];
                                var tab1=[];
                                tab.push(i+"时");
                                tab1.push(i+"时");
                                var end=(interval * (num+1));
                                for(var j=(num * interval);j<end; j++){
                                    tab.push(item.data.val[j]);

                                    var qty=item.data.QTY[j];
                                    var qtyvalue='';
                                    switch (qty){
                                        case  0:
                                            qtyvalue="好";
                                            break;
                                        case  1:
                                            qtyvalue="坏";
                                            break;
                                        case  2:
                                            qtyvalue="旧";
                                            break;
                                    }
                                    tab1.push(qtyvalue);
                                }
                                num++;
                                tableData.push(tab);
                                tableData.push(tab1);
                            }
                            that.tableData=tableData;
                        }
                    }
                }
            },
            //显示遥信数据
            viewdigitTableData(data){
                let that=this;
                var tableData=[];
                for(var item of data) {
                    if (item.data) {
                        for(var i=0;i<item.data.val.length;i++){
                            var da=[];
                            var qty=item.data.QTY[i];
                            var qtyvalue='';
                            switch (qty){
                                case  0:
                                    qtyvalue="好";
                                    break;
                                case  1:
                                    qtyvalue="坏";
                                    break;
                                case  2:
                                    qtyvalue="旧";
                                    break;
                            }
                            var time=that.formatDate(new Date(item.data.time[i]*1000));
                            da.push(i+1);
                            da.push(time);
                            da.push(item.data.val[i]);
                            da.push(qtyvalue);
                            tableData.push(da);
                        }
                    }
                }
                that.tableData=tableData;
            },
            //显示遥信分析结果数据
            viewdigitTotalData(data,interval){
                let that=this;
                var puttime=0;
                var stoptime=0;
                var putpercentage="";
                var stoppercentage="";
                var openclosecount=0;
                var offcount=0;
                var oncount=0;
                for(var item of data) {
                    if (item.data) {
                        var putcount=0;
                        var stopcount=0;
                        var lastval="";
                        for (var i = 0; i < item.data.val.length; i++) {
                            var val=item.data.val[i];
                            if(i>0){
                                lastval=item.data.val[i-1];
                                if(lastval=="1" && val=="0"){
                                    offcount++;
                                }
                                else if(lastval=="0" && val=="1"){
                                    oncount++;
                                }
                            }
                            if(val=="0"){
                                stoptime +=interval;
                                stopcount ++;
                            }else if(val=="1"){
                                puttime +=interval;
                                putcount ++;
                            }
                        }
                        putpercentage=parseInt((putcount/item.data.val.length)*100)+"%";
                        stoppercentage=parseInt((stopcount/item.data.val.length)*100)+"%";
                        openclosecount=parseInt(offcount+oncount);
                    }
                }


                var totalDigitData={};
                totalDigitData.puttime=puttime+"分";
                totalDigitData.stoptime=stoptime+"分";
                totalDigitData.putpercentage=putpercentage;
                totalDigitData.stoppercentage=stoppercentage;
                totalDigitData.openclosecount=openclosecount;
                totalDigitData.offcount=offcount;
                totalDigitData.oncount=oncount;
                that.totalDigitData=totalDigitData;

            },

            //导出的excel数据源
            setExcelTableData(data){
                let that=this;
                var tableData=[];
                for(var item of data) {
                    if (item.data) {
                        for(var i=0;i<item.data.val.length;i++){
                            var da={};
                            var qty=item.data.QTY[i];
                            var qtyvalue='';
                            switch (qty){
                                case  0:
                                    qtyvalue="好";
                                    break;
                                case  1:
                                    qtyvalue="坏";
                                    break;
                                case  2:
                                    qtyvalue="旧";
                                    break;
                            }
                            var time=that.formatDate(new Date(item.data.time[i]*1000));
                            da.num=parseInt(i+1)+"";
                            da.time=time;
                            da.val=item.data.val[i];
                            da.qty=qtyvalue;
                            tableData.push(da);
                        }
                    }
                }
                that.tableDataList=tableData;
            },
            //获取最大最小值
            getMinMaxData(tbname,id,begintime,endtime){
                let that = this;
                var params={
                    "tbname":tbname,
                    "id":id,
                    "begintime":begintime,
                    "endtime":endtime,
                    "aggr":["min","max","avg"]
                };
                that.$http
                    .post(that.BASE_INFO.BASE_ARCH_URL+"/summary", params)
                    .then(function (response) {
                        if(response && response.data && response.data.result &&  response.data.replyCode.code==0){
                            var data=response.data.result;
                            if(data.time.length>2){
                                var total={};
                                total.minvalue=data.value[0];
                                total.mintime=that.formatDate(new Date(data.time[0]*1000));
                                total.maxvalue=data.value[1];
                                total.maxtime=that.formatDate(new Date(data.time[1]*1000));
                                total.avgvalue=data.value[2];
                                that.totalData=total;
                            }

                        }
                    });
            },
            //导出数据
            exportToExcel(){
                if(this.tableDataList.length>0){
                    this.downloadLoading = true;
                    require.ensure([], () => {
                        const { export_json_to_excel } = require('@/vendor/Export2Excel')
                        const tHeader = ['序号', '日期', '值','质量码'];
                        const filterVal = ['num', 'time', 'val',"qty"];
                        const list = this.tableDataList;
                        const data = this.formatJson(filterVal, list);
                        export_json_to_excel(tHeader, data, '列表excel');
                        this.downloadLoading = false;
                    });
                }

            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },

            //创建补0函数
            p(s) {
                return s < 10 ? '0' + s : s;
            },
            //时间格式化
            formatDate(date) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + this.p(date.getHours()) + ":" + this.p(date.getMinutes()) + ":" + this.p(date.getSeconds());
            },
        },
        components: {
            vtree,
            vcharts
        },
    }
</script>

<style>
.sapn-margin-left{
    margin-left: 5px;
}
.el-row {
    margin-bottom: 20px;
&:last-child {
     margin-bottom: 0;
 }
}
.div-table{
    margin-top: 20px;
}
.el-col {
    border-radius: 4px;
}
.bg-purple-dark {
    background: #EDEEF2;
}
.bg-purple {
    background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    border-radius: 4px;
    min-height: 100px;
    text-align: center;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
    .p-center{
        text-align: center;
        font-size: 12px;
    }
    .bold{
       font-weight: bold;
        padding-top: 20px;
        font-size: 18px;
    }
.div-top-content{
    margin-top: 5px;
    font-size: 12px;
}

</style>
