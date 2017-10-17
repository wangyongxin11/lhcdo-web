import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import './styles/iview.css';
import { getToken } from './libs/auth';
import { removeToken } from './libs/auth';

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);
const whiteList = ['/login']; // 不重定向白名单
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    if(getToken()){
        if (to.path === '/login') {
            next({ path: '/' });
        } else {
            next();
        }
    } else {
        if(whiteList.indexOf(to.path) !== -1){
            next();
        }else {
            next({
                path:'/login',
                query:{redirect: to.fullPath}
            });
        }
    }
    Util.title(to.meta.title);
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

Util.ajax.interceptors.request.use(function (config) {
    if(getToken()){
        //已登录
        config.headers.Authorization = getToken();
    }
    return config;
});

Util.ajax.interceptors.response.use(function (response) {
    if(response.data&&'2'==response.data.statusCode){
        //未登录
        iView.Modal.error({
            title:'错误',
            content:response.data.statusInfo,
            onOk:function () {
                removeToken();
                router.replace({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}
                });
            }
        });
    }
    return response;
});

const store = new Vuex.Store({
    state: {
        username:''
    },
    getters: {

    },
    mutations: {
        changeUsername(state,payLoad){
            state.username = payLoad.username;
            localStorage.setItem('username',payLoad.username);
        }
    },
    actions: {

    }
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});