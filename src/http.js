import axios from 'axios'
import qs from 'qs'


export default {
    //get请求
    get(url, param) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                headers:{"Content-Type":'application/x-www-form-urlencoded;'},
                url,
                params: param
            }).then(res => {
                resolve(res)
            })
        })
    },
    //post请求
    post(url, param) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                headers:{"Content-Type":'application/x-www-form-urlencoded'},
                url,
                data: param
            }).then(res => {
                resolve(res)
            })
        })
    }
}
