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
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },
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
                component: resolve => { require(['./views/business/index.vue'], resolve); }
            },
            {
                path: 'defaultRate',
                icon: 'pound',
                name: 'defaultRate',
                title: '理想违约率',
                component: resolve => { require(['./views/business/index.vue'], resolve); }
            },
            {
                path: 'settings',
                icon: 'crop',
                name: 'settings',
                title: '大额测试设置',
                component: resolve => { require(['./views/business/index.vue'], resolve); }
            },
            {
                path: 'industry',
                icon: 'arrow-move',
                name: 'industry',
                title: '行业分类',
                component: resolve => { require(['./views/business/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/calculate',
        icon: 'social-buffer',
        name: 'calculate',
        title: '计算',
        component: Main,
        children: [
            {
                path: 'portfolioList',
                icon: 'compose',
                name: 'portfolioList',
                title: '资产池列表',
                component: resolve => { require(['./views/business/defaultRateTable.vue'], resolve); }
            },
            {
                path: 'portfolioMonte',
                icon: 'pound',
                name: 'portfolioMonte',
                title: '组合资产违约风险模拟',
                component: resolve => { require(['./views/business/defaultRateTable.vue'], resolve); }
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