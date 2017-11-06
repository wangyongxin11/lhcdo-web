import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import {routers,otherRouter,appRouter} from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import './styles/iview.css';
import { getToken,removeToken } from './libs/auth';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView);

// 路由配置
const RouterConfig = {
    //mode: 'history',
    routes: routers
};
const router = new VueRouter(RouterConfig);
const whiteList = ['/login']; // 不重定向白名单
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    if(getToken()){
        if (to.path === '/login') {
            next({ name: 'home_index' });
        } else {
            if(Util.getRouterObjByName([otherRouter, ...appRouter], to.name)){
                Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next);
            }else {
                /*router.replace({
                    name: 'error_401'
                });*/
                next();
            }
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

const store = new Vuex.Store({
    state: {
        user:null,
        tagsList:[...otherRouter.children],
        menuList:[]
    },
    getters: {

    },
    mutations: {
        changeUser(state,payLoad){
            state.user = payLoad.user;
            if(payLoad.user){
                localStorage.setItem('user',JSON.stringify(payLoad.user));
            }
        },
        setTagsList(state,tagsList){
            state.tagsList.push(...tagsList);
        },
        updateMenuList(state){
            let menuList=[];
            appRouter.forEach((item)=>{
                menuList.push(item);
            });
            state.menuList = menuList;
        }
    },
    actions: {

    }
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

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 权限菜单过滤相关
        this.$store.commit('updateMenuList');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});