import Index from './views/layout/index.vue';
import CalDefaultRate from './views/business/defaultRateTable.vue';
import Layout from './views/business/index.vue';
import Login from './views/login/login.vue';

const routers = [
    {
        path: '/',
        meta: {
            title: '联合信用评级数据分析平台'
        },
        name:'首页',
        redirect:'calDefaultRate',
        component: Index,
        children:[
            {
                path:'calDefaultRate',
                meta: {
                    title: '违约率计算'
                },
                component: CalDefaultRate,
                name:'calDefaultRate'
            }
        ]
    },
    {
        path: '/index',
        meta: {
            title: '基础数据管理'
        },
        name:'index',
        component: Layout
    },
    {
        path: '/login',
        meta: {
            title: '登录'
        },
        name:'login',
        component: Login
    }
];

export default routers;