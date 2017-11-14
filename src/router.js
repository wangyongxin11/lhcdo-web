import Main from './views/layout/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '联合评级数据分析平台 - 登录'
    },
    component: resolve => { require(['./views/login/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },
        { path: 'simulationRecordList/:portfolioId', title: '资产池计算结果列表', name: 'simulationRecordList', component: resolve => { require(['./views/result/simulationRecordList.vue'], resolve); } }
    ]
};

export const appRouter = [
    {
        path: '/base',
        icon: 'social-buffer',
        name: 'base',
        title: '基础数据',
        component: Main,
        children: [
            {
                path: 'dict',
                icon: 'compose',
                name: 'dict',
                title: '数据字典',
                component: resolve => { require(['./views/business/portfolioList.vue'], resolve); }
            },
            {
                path: 'defaultRate',
                icon: 'pound',
                name: 'defaultRate',
                title: '理想违约率',
                component: resolve => { require(['./views/business/portfolioList.vue'], resolve); }
            },
            {
                path: 'settings',
                icon: 'ios-settings-strong',
                name: 'settings',
                title: '大额测试设置',
                component: resolve => { require(['./views/business/portfolioList.vue'], resolve); }
            },
            {
                path: 'industry',
                icon: 'ios-gear',
                name: 'industry',
                title: '行业分类',
                component: resolve => { require(['./views/business/portfolioList.vue'], resolve); }
            }
        ]
    },
    {
        path: '/calculate',
        icon: 'ios-analytics',
        name: 'calculate',
        title: '计算',
        component: Main,
        children: [
            {
                path: 'portfolioList',
                icon: 'ios-list',
                name: 'portfolioList',
                title: '资产池列表',
                component: resolve => { require(['./views/business/portfolioList.vue'], resolve); }
            },
            {
                path: 'cashFlow',
                icon: 'shuffle',
                name: 'cashFlow',
                title: '现金流',
                component: resolve => { require(['./views/business/portfolioList.vue'], resolve); }
            }
        ]
    },
    {
        path: '/result',
        icon: 'ios-search-strong',
        name: 'result',
        title: '结果查询',
        component: Main,
        children: [
            {
                path: 'simulatedPortfolioList',
                icon: 'navicon',
                name: 'simulatedPortfolioList',
                title: '组合资产违约风险',
                component: resolve => { require(['./views/result/simulatedPortfolioList.vue'], resolve); }
            },
            {
                path: 'cashFlowResultList',
                icon: 'ios-list-outline',
                name: 'cashFlowResultList',
                title: '现金流',
                component: resolve => { require(['./views/business/components/portfolioInfo.vue'], resolve); }
            }
        ]
    }
];

export const routers = [
    loginRouter,
    page401,
    page404,
    page500,
    otherRouter,
    ...appRouter
];