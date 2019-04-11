
//阿里云地址
const BASE_DATA_URL='http://39.107.67.255:7099/api/snap';//数据模型
const BASE_ARCH_URL='http://39.107.67.255:9198/api/arch';//历史服务

//内部服务器地址
//const BASE_DATA_URL='http://192.168.2.18:30003/api/snap';//数据模型
//const BASE_ARCH_URL='http://192.168.2.18:30009/api/arch';//历史服务

const BASE_LOGIN_URL = 'http://39.107.241.142:9000/THPISC/';//登录权限服务
const BASE_CONTROL_URL = "http://39.107.241.142:3502/rmsg/send_control_commmd";//设备遥控服务
const BASE_SERVICES_URL = "http://39.107.241.142/api/";
const KAFKA_WS_URL = 'http://39.107.241.142:3502';//kafka调用
const SOCKET_URL='ws://39.107.241.142:3500/';     //kafka监控数据地址
const ALARM_URL='http://192.168.219.226:9099/api/alarm';    //历史告警服务


//用户登录
const SysInfo = {
  client_id: '40288109638fb7ff01638fbae8c60002',
  client_secret: 'b97e4b4c-6fef-4c9d-948b-fd9d39d71dc9',
  scope: 'read,write',
  grant_type: 'password'
};

export default {
    "BASE_DATA_URL":  process.env.BASE_DATA_URL ||BASE_DATA_URL,
    "BASE_ARCH_URL": process.env.BASE_ARCH_URL || BASE_ARCH_URL,
    "BASE_LOGIN_URL": process.env.BASE_LOGIN_URL || BASE_LOGIN_URL,
    "BASE_CONTROL_URL": process.env.BASE_CONTROL_URL || BASE_CONTROL_URL,
    "SysInfo": SysInfo,
    "BASE_SERVICES_URL": process.env.BASE_SERVICES_URL || BASE_SERVICES_URL,
    "KAFKA_WS_URL": process.env.KAFKA_WS_URL ||KAFKA_WS_URL,
    "SOCKET_URL": process.env.SOCKET_URL ||SOCKET_URL,
     "ALARM_URL": process.env.ALARM_URL ||ALARM_URL,
}
