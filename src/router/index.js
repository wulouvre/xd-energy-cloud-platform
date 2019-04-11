import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    base:'/dbquery',
    routes: [
        {
            path: '/realtime',
            name: 'realtime',
            component: resolve => require(['../components/page/xd/xd.RealTimemore.vue'], resolve),
        },
        {
            path: '/archive',
            name: 'archive',
            component: resolve => require(['../components/page/xd/xd.RealTimemore.vue'], resolve),
        },
        {
            path: '/archivedata',
            name: 'archivedata',
            component: resolve => require(['../components/page/xd/xd.Archive.vue'], resolve),
        },
        {
            path: '/realtimealarm',
            name: 'realtimealarm',
            component: resolve => require(['../components/page/xd/xd.realtimeAlarm.vue'], resolve),
        },
        {
            path: '/archivealarm',
            name: 'archivealarm',
            component: resolve => require(['../components/page/xd/xd.archiveAlarm.vue'], resolve),
        },
        {
            path: '/selector',
            name: 'selector',
            component: resolve => require(['../components/page/xd/xd.selector.vue'], resolve),
        },
        {
            path: '/charts',
            name: 'charts',
            component: resolve => require(['../components/page/xd/charts.vue'], resolve),
        },
        {
            path: '/tree',
            name: 'tree',
            component: resolve => require(['../components/page/xd/tree.vue'], resolve),
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
