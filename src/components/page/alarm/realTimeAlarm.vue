<template>
    <div>
        <!--<audio autoplay="autoplay"-->
        <!--controls="controls"-->
        <!--preload="auto"-->
        <!--src="http://39.107.67.255:8000/alarmfile/AR_PROCESS_START.mp3">-->
        <!--</audio>-->
        <audio ref="audio" autoplay="autoplay"
               preload="auto"
               @ended="audioEnded" :src="audioSrc">
        </audio>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部分类" name="all"></el-tab-pane>
            <el-tab-pane label="遥信" name="遥信"></el-tab-pane>
            <el-tab-pane label="遥测" name="遥测"></el-tab-pane>
            <el-tab-pane label="操作事件" name="操作事件"></el-tab-pane>
            <el-tab-pane label="SOE" name="SOE"></el-tab-pane>
            <el-tab-pane label="系统警告" name="系统警告"></el-tab-pane>
            <el-tab-pane label="其他告警" name="其他告警"></el-tab-pane>
        </el-tabs>
        <div style="float: right">


            <el-button type="primary" icon="el-icon-check" v-on:click='operationMsgs("confirm")'>确认</el-button>
            <el-button type="primary" icon="el-icon-delete" v-on:click='operationMsgs("delete")'>删除</el-button>
            <el-button type="primary" icon="el-icon-caret-right" v-on:click='playAudio'> {{playtext}}</el-button>
        </div>
        <div style="margin-top: 40px;">
            <el-table
                ref="multipleTable"
                :data="alarmList"
                :max-height="tableheight"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="headercellstyle"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="序号"
                    prop="num"
                    width="60">
                    <!--<template slot-scope="scope">{{ scope.row.num }}</template>-->
                </el-table-column>
                <el-table-column
                    prop="priority"
                    label="告警等级"
                    width="80">
                    <template slot-scope="scope">
                        <div v-bind:style="{background:scope.row.bgcolor}"
                             style="width: 35px;height: 22px;text-align: center;color: #ffffff;">
                            <span>{{scope.row.priority}}</span></div>
                        <!--<span  v-bind:style="{background:scope.row.alarmbgcolor}">{{scope.row.priority}}</span>-->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="告警时间"
                    width="160">
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="告警内容"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="cobject"
                    label="告警区域"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="object"
                    label="告警对象"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="stype"
                    width="120"
                    label="告警类型">
                </el-table-column>
                <el-table-column
                    prop="cause"
                    width="120"
                    label="告警原因"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">确认
                        </el-button>
                        <el-button
                            size="mini"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueWebsocket from "vue-websocket";
    Vue.use(VueWebsocket,Vue.BASE_INFO.SOCKET_URL, {
        reconnection: false,
        "force new connection": true,
        transports: ["websocket"]
    });

    export default {
        data: function () {
            return {
                tableheight: document.body.clientHeight - 200,
                activeName: 'all',
                tableData3: [
                    {
                        date: '2016-05-03',
                        priority: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-02',
                        priority: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-04',
                        priority: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-01',
                        priority: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-08',
                        priority: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-06',
                        priority: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-07',
                        priority: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }],
                multipleSelection: [],  //选中的行
                alarmList: [],  //告警列表
                alarmIDs: [],
                msgDatas: [],//全部告警
                num: 0,  //标识
                usid: "",  //当前界面唯一标识
                alarmAudio: {},  //音频
                isplay: true,  //是否播放音频
                audioSrc: '',  //音频
                queue: [],  //
                audio: {
                    // 该字段是音频是否处于播放状态的属性
                    playing: false
                },
                audionum: 0,
                playtext: "暂停",
            };
        },
        mounted() {
            let that = this;
//            that.autoHeight();
            that.usid = that.getuid();
        },
        methods: {
            autoHeight() {
                let that = this;
                var height = document.body.clientHeight;
                that.tableheight = height - 200;
            },
            headercellstyle({row, column, rowIndex, columnIndex}) {
                return "background:#F7F8FA;font-weight: bold;color: #101010;";
            },
            //选中的行
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            //表格的行样式
            tableRowClassName({row, rowIndex}) {
                if (row.color) {
                    return "color: " + row.color;
                } else {
                    return "color: #434343;";
                }
                return '';
            },
            //确认消息
            handleEdit(index, row) {
//          console.log(index, row);
                var type = "confirm";
                this.operationMsg(row, type);
            },
            //删除消息
            handleDelete(index, row) {
                var type = "delete";
                this.operationMsg(row, type);
            },
            //切换tab
            handleClick(val){
                const that = this;
                var resultlist = [];
                if (that.msgDatas) {
                    if (val.name == "all") {
                        resultlist = that.msgDatas;
                    }
                    else {
                        for (var item of that.msgDatas) {
                            if (item.category == val.name) {
                                resultlist.push(item);
                            }
                        }
                    }
                    that.alarmList = resultlist;
                }
            },
            //加载数据
            initAlarmList: function (data) {
                const self = this;
                var msg = JSON.parse(data);
                if (msg) {
                    if (msg.reason == "unconfirmed") {
                        self.setAlarm(msg);
                    }
                    else if (msg.alarm instanceof Array && msg.alarm[0].reason == "new") {
                        self.setAlarm(msg);
                    }
                    else if (msg.alarm && msg.alarm.reason == "new") {
                        self.setAlarm(msg);
                    }

                    else {
                        self.Msghandle(msg);
                    }
                }
            },
            //处理主动发送来的告警
            setAlarm: function (msg) {
                const self = this;
                if (msg.alarm instanceof Array) {
                    //判断数据是否有效
                    var str = msg.sendtime;
                    str = str.replace(/-/g, "/");
                    var time = new Date(str);
                    var today = new Date();
                    //var hour=(today.getTime()-time.getTime())/ 1000 / 60 / 60; //小时
                    var minutes = (today.getTime() - time.getTime()) / 1000 / 60;
                    if (!isNaN(minutes) && minutes > 60) {
                    }
                    else {
                        for (var i = 0; i < msg.alarm.length; i++) {
                            if ((self.alarmIDs.indexOf(msg.alarm[i].id) > -1) || msg.alarm[i].content == "") {
                                continue;
                            }
                            else {
//                //语音播报信息
                                if (msg.alarm[i].reason == "new" && msg.reason != "unconfirmed") {
                                    self.setAudio(msg);
                                }
//                         var mess={"action":"change","alarm":[{"ackmode":2,"alarmbgcolor":"#00FFFF","alarmcolor":"#000000","category":"系统告警","cause":"进程启动","cobject":"","confirmbgcolor":"#00FF00","confirmcolor":"#000000","content":"2018-8-30 15:0:28 000 进程事项: centos764节点  进程启动","id":"180830150041011340","mdelflag":1,"object":"","priority":"五级","reason":"new","rescoverbgcolor":"#00FF00","rescovercolor":"#000000","status":"1","stype":"进程事项","time":"2018-08-30 15:00:28.000"}],
//                             "audio":{"file":"http://39.107.67.255:8000/alarmfile/AR_PROCESS_START.mp3"},"audiotimes":9999,"count":1,"pid":16059,"sendtime":"2018-08-30 15:00:41","src":"alarmd","type":"alarm"};
//                          self.setAudio(mess);
                                self.alarmIDs.push(msg.alarm[i].id);
                                self.msgtoTableView(msg.alarm[i]);
                            }
                        }
                    }
                }
            },
            //处理请求处理的结果
            Msghandle: function (msg) {
                const self = this;
                var alarms = msg.alarm;
                var ucid = msg.cid;
                var deleteIds = [];  //删除的id
                if (alarms) {
                    for (var i = 0; i < alarms.length; i++) {
                        var item = alarms[i];
                        for (var j = 0; j < self.alarmList.length; j++) {
                            if (item.id == self.alarmList[j].id) {
                                if (item.status > 0) {
                                    //删除
                                    if (item.reason == "deleted") {
                                        deleteIds.push(item.id);
                                    }
                                    else if (item.reason == "confirmed") {
                                        //确认行变色
                                        self.updateAlarmList(self.alarmList, "update", item.id);
                                        self.updateAlarmList(self.msgDatas, "update", item.id);
                                    }
                                }
                                else {
                                    if (ucid != "" && ucid == usid) {
                                        if (item.reason = "delete is not allowed") {
                                            alert("删除失败！");
                                            break;
                                        }
                                        else if (item.reason = "failed") {
                                            alert("确认失败！");
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //要删除的数据
                    if (deleteIds && deleteIds.length > 0) {
                        for (var del = 0; del < deleteIds.length; del++) {
                            var delitem = deleteIds[del];
                            //删除报警列表中的数据
                            self.updateAlarmList(self.alarmList, "del", delitem);
                        }
                    }
                }
            },
            //加载报警消息通知
            msgtoTableView: function (msg) {
                const self = this;
                self.num++;
                msg.num = self.num;
                msg.bgcolor = msg.alarmbgcolor;
                msg.color = msg.alarmcolor;
                self.alarmList.push(msg);
                self.msgDatas.push(msg);
            },
            //修改报警列表信息
            updateAlarmList: function (msgDatas, type, id) {
                if (msgDatas) {
                    for (var i = 0; i < msgDatas.length; i++) {
                        var item = msgDatas[i];
                        if (id == item.id) {
                            if (type == "update") {
                                //已确认修改过
                                item.type = "confirmed";
                                item.bgcolor = item.confirmbgcolor;
                                item.color = item.confirmcolor;
                            }
                            else if (type == "del") {
                                //删除
                                msgDatas.splice(item, 1);
                            }
                            break;
                        }

                    }
                }
            },
            //播放结束时触发
            audioEnded: function () {
//          var x= document.querySelector('#myaudio');
                var x = this.$refs.audio;
                if (!this.isplay) {
//        this.$refs.audio.pause();
                    x.pause();
                    this.$refs.audio.currentTime = 0;
                }
                else {
                    this.playSrc(this.audionum);
                }
            },
            playSrc: function (audionum) {
                if (this.audionum == this.queue.length - 1) {
                    this.audionum = -1;
                }
                this.audionum++;
                if (this.queue.length > 0) {
                    var event = this.queue[this.audionum];
                    if (event.times == 0) {
                        playSrc(this.audionum);
                    } else {
                        this.audioSrc = event.file;
                        var x = this.$refs.audio;
                        x.src = event.file;
                        x.play();
                    }
                }
            },
            //播放
            playAudio: function () {
                this.isplay = !this.isplay;
                var x = this.$refs.audio;
                if (this.isplay) {
                    this.playtext = "暂停";
                    x.play();  //播放
                }
                else {
                    this.playtext = "播放";
                    x.pause(); //停止
                }
            },
            //添加语音播报信息
            setAudio: function (msg) {
                var x = this.$refs.audio;
                //语音播报(新的信息)
                if (this.queue.length == 0) {
                    this.audioSrc = msg.audio.file;
                    x.src = msg.audio.file;
                    x.play();
                }
                var myaudio = {};
                if (msg.alarm instanceof Array) {
                    myaudio.id = msg.alarm[0].id;
                }
                myaudio.file = msg.audio.file;
                myaudio.times = msg.audiotimes;
                this.queue.push(myaudio);

            },
            //获取未确认消息
            getUnconfirmedMsg: function () {
                const self = this;
                self.alarmIDs = [];  //清空数据
                var date = new Date();
                var msg = {
                    cid: self.usid,
                    type: "alarm",
                    action: "RequestUnconfirmed",
                    username: "wly",
                    userid: "123",
                    sendtime: self.formatDate(date),
                    begin: "1",
                    count: "-1"
                }
                this.setToKafka(msg);
            },

            //全部确认或删除
            operationMsgs: function (msgtype) {
                const self = this;
                var ids = []
                for (i = 0; i < self.multipleSelection.length; i++) {
                    var item = {};
                    item.id = self.multipleSelection[i].id;
                    ids.push(item);
                }
                if (ids.length > 0) {
                    var date = new Date();
                    var msg = {
                        cid: self.usid,
                        type: "alarm",
                        action: msgtype,
                        username: "wly",
                        userid: "123",
                        sendtime: self.formatDate(date),
                        alarm: ids
                    };
                    self.setToKafka(msg, "more");
                }
                else {
                    alert("请最少选择一条信息！");
                }

            },
            //确认报警
            operationMsg: function (msg, msgtype) {
                const self = this;
                var date = new Date();
                if (msg) {
                    var id = msg.id;
                    var key = "";
                    var msg = {
                        cid: self.usid,
                        type: "alarm",
                        action: msgtype,
                        username: "wly",
                        userid: "123",
                        sendtime: self.formatDate(date),
                        alarm: [
                            {id: id}
                        ]

                    };
                    self.setToKafka(msg);
                }
            },
            //发送kafka请求
            setToKafka: function (msg) {
                const that = this;
                var key = "";
                var params = {key: key, message: JSON.stringify(msg)};
//          var params = {key: key, message: msg};
                that.$http
                    .post(that.BASE_INFO.KAFKA_WS_URL + "/ws/toKafka", params)
                    .then(function (response) {
                        var da = response;
                    });
            },
            //生成随机数
            getuid() {
                var date = new Date();
                var uuid = date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds();
                //alert(uuid);
                return uuid;
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
//        computed: {
//            alarmList() {
//                return this.alarmList.reverse();
//            }
//        },

            socket: {
            events: {
                msg: function (data) {
                    if (data) {
                        this.initAlarmList(data);
                    }
                },
                connect() {
                    console.info("Websocket链接成功");
                    this.getUnconfirmedMsg();
                },
                disconnect() {
                    console.log("Websocket disconnected from " + this.$socket.nsp);
                },
                error(err) {
                    console.error("Websocket error!", err);
                }
            }
        }

    };
</script>

<style scoped>

</style>
