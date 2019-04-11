<template>
<div>
    <div id="mychart" style="width: 100%;height: 100%;"></div>
</div>
</template>

<script>
    import echarts from "echarts";
    export default {
        data () {
            return {
                chartID:'mychart',
                startTime:'',  //起始时间
                endTime:'',    //结束时间
                isviewTimeAll:false,  //是否显示全部
                interval:2,  //间隔

            }
        },
        created(){

        },
        mounted(){
            let that=this;
            var date = new Date(); //获取当前时间
            var preDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
            var startDate=Date.parse(preDate);
            var endDate=Date.parse(date);
            that.startTime=startDate;
            that.endTime=endDate;
            var dataList=[];
//            //起始时间和结束时间
//            for (var i = 0; i < 1; i++) {
//                var data = {};
//                data.id = i;
//                data.name = "测点" + i;
//                data.data = [];
//                data.ydata = [];
//
//                for (var j = startDate; j < endDate; j++) {
//                    var item = {};
//                    item.time = this.formatDate(new Date(j));
//                    item.value = parseInt(Math.random() * 100);
//                    data.data.push(item);
//                    data.ydata.push(item.value);
//                    j = j + 1000 * 60*60;
//
//                }
//                dataList.push(data);
//                that.initDataToChart1(dataList,this.chartID);
//            }
        },
        methods:{
            //给echart赋值
            initDataToChart: function (datalist,startDate,endDate,interval) {
                let that=this;
                ///////////起始时间//////////////////////////
                var startTime=new Date(startDate);
                var endTime=new Date(endDate);
               if(endTime > startTime){
                   if(startTime.getFullYear()==endTime.getFullYear() && startTime.getMonth()==endTime.getMonth()){
                        if(startTime.getDate()==endTime.getDate()){
                            that.isviewTimeAll=false;
                        }
                        else if(endTime.getDate()>startTime.getDate()){
                            that.isviewTimeAll=true;
                        }
                   }
               }
               that.interval=parseInt(60/interval);
                ///////////////////////////////////////
                var series = [];
                var legend = [];
                var xData=[];
                var lineStyles=[];
                if (datalist) {
                    for(var index in datalist){
                       if(datalist[index].data){
                           var ser = {
                               name:datalist[index].id,
                               type: 'line',
                               symbol: "none",  //不显示小圆点
                               showSymbol: false,
                               data:datalist[index].data.val,
                               lineStyle:lineStyles[index],
                           };
                           if(index==0){
                               if(datalist[index].data.time){
                                   for(var valueitem of datalist[index].data.time){
                                        xData.push(that.formatDate(new Date(valueitem*1000)));
                                       }
                               }
//                               for(var i=0;i<24; i++){
//                                   xData.push(i);
//                               }
                           }
//
                           series.push(ser);
                           legend.push(datalist[index].id+"");
                       }
                    }


                    var  xAxis={
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {onZero: true},
                        data: xData,
                        axisLabel: {
                            show: true,
                            formatter:function(params) {
                                var date = new Date(params);
                                var viewdate=params;
                                if(that.isviewTimeAll){
                                    viewdate=(date.getMonth() + 1) + "-" + date.getDate() + " " + that.p(date.getHours()) + ":" + that.p(date.getMinutes());
                                }
                                else {
                                    viewdate=that.p(date.getHours()) + ":" + that.p(date.getMinutes());
                                }
                                return   viewdate;

                            },
                        },
                    };
                    if(!that.isviewTimeAll){
                        xAxis.interval=that.interval;
                    }

                 }
                that.initEchart(xData, legend,xAxis, series);
            },

            //给echart赋值
            initDataToChart1: function (datalist, echartId) {
                let that=this;
                this.chartID = echartId;
                var series = [];
                var legend = [];
                var xData;
                var lineStyles=[];
                if (datalist) {
                    for (var index in datalist) {
                        var xy = that.getXY(datalist[index]);
                        var ser = {
                            name: xy.yname,
                            type: 'line',
                            smooth: true,
                            data: xy.y,
                            lineStyle:lineStyles[index],
                        };

                        xData = xy.x;
                        series.push(ser);
                        legend.push(xy.yname);
                    }
                }
                var colors=[];
                that.initEchart(xData, legend,colors, series);
            },
            //给echart的xy轴赋值
            getXY: function (data) {
                var xy = {};
                if (data) {
                    var xData = [];
                    var yData = [];
                    var list = data.data;
                    for (var i = 0; i < list.length; i++) {
                        var time = new Date(list[i].time);
                        //var date = time.getHours() + ":" + time.getMinutes();
                        var date = list[i].time;
                        xData.push(date);
                        var value = list[i].value;
                        yData.push(value);
                    }
                    xy.x = xData;
                    xy.yname = data.name;
                    xy.y = yData;
                    return xy;

                }
            },
            //加载echart
            initEchart: function (xData, legend, series) {
                let that=this;
                var option = {
                    title: {
                        text: '日曲线'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
//                    color:colors,
//                    legend: {
//                        x: 'right',
//                        orient: 'vertical',
//                        padding: 20,
//                        itemWidth:20,
//                        itemHeight:4,
//                        icon:'bar',
//                        data: legend
//                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '6%',
                        containLabel: true
                    },
                    dataZoom: {
                        // width: 300,
                        // height: 25,
                        // x: 145,
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {onZero: true},
                        data: xData,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisPointer: {
                            snap: true
                        }
                    },
                    series: series
                };

                var myChart1 = echarts.init(document.getElementById(this.chartID));
                myChart1.setOption(option);
                // mychart = myChart1;

            },
            //加载echart
            initEchart: function (xData, legend,xAxis, series) {
                let that=this;
                var option = {
                    title: {
                        text: '日曲线'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
//                    color:colors,
//                    legend: {
//                        x: 'right',
//                        orient: 'vertical',
//                        padding: 20,
//                        itemWidth:20,
//                        itemHeight:4,
//                        icon:'bar',
//                        data: legend
//                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '6%',
                        containLabel: true
                    },
                    dataZoom: {
                        // width: 300,
                        // height: 25,
                        // x: 145,
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    xAxis: xAxis,
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisPointer: {
                            snap: true
                        }
                    },
                    series: series
                };

                var myChart1 = echarts.init(document.getElementById(this.chartID));
                myChart1.setOption(option);
                // mychart = myChart1;

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
        }
    }
</script>

<style>
.sapn-margin-left{
    margin-left: 10px;
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
</style>
