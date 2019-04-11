import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    base:'/dbquery',
    routes: [
        {
            path: '/',
            name: 'realTime',
            component: resolve => require(['../components/page/db/RealTime.vue'], resolve),
        },
        {
            name: "index",
            path: '/index',
            component: resolve => require(['../components/page/Index.vue'], resolve),
        },
        {
            path: '/realtime',
            name: 'realtime',
            component: resolve => require(['../components/page/db/RealTime.vue'], resolve),
        },

        {
            path: '/archive',
            name: 'archive',
            component: resolve => require(['../components/page/db/archiveData.vue'], resolve),
        },
        {
            path: '/realtimealarm',
            name: 'realtimealarm',
            component: resolve => require(['../components/page/alarm/realTimeAlarm.vue'], resolve),
        },
         {
                    path: '/archivealarm',
                    name: 'archivealarm',
                    component: resolve => require(['../components/page/alarm/archiveAlarm.vue'], resolve),
          },
         {
            path: '/selector',
            name: 'selector',
            component: resolve => require(['../components/page/db/selector.vue'], resolve),
         },
        {
            path: '/db',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '实时库查询' },
            children: [
                {
                    path: '/real-time',
                    name: 'real-time',
                    component: resolve => require(['../components/page/db/RealTime.vue'], resolve),

                },
                {
                    path: '/archivedata',
                    name: 'archivedata',
                    component: resolve => require(['../components/page/db/archiveData.vue'], resolve),

                }
            ]
        },
        {
            path: '/alarm',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '告警' },
            children: [
                {
                    path: '/realtimealarm',
                    name: 'realtimealarm',
                    component: resolve => require(['../components/page/alarm/realTimeAlarm.vue'], resolve),

                },
                     {
                    path: '/archivealarm',
                    name: 'archivealarm',
                    component: resolve => require(['../components/page/alarm/archiveAlarm.vue'], resolve),

                },
            ]
        },

        {
            path: '/sms',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '调试工具'},
            children: [
                {
                    path: '/communication',
                    name: 'communication',
                    component: resolve => require(['../components/page/SMS/Communication.vue'], resolve),
                    meta: { title: '通讯调试' }
                }

            ]
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/temp',
                    name: 'temp',
                    component: resolve => require(['../components/page/Temp.vue'], resolve),
                    meta: { title: '过渡' }
                },
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },

                {
                    path: '/iframe',
                    name: 'iframe',
                    component: resolve => require(['../components/page/IFrame.vue'], resolve),
                    meta: { title: 'iframe' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
