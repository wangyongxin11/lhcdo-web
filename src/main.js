import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import {routers,otherRouter,appRouter} from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import { getToken,removeToken } from './libs/auth';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView);

// 路由配置
const RouterConfig = {
    mode: 'history',
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
        loading:false,
        routers: [
            otherRouter,
            ...appRouter
        ],
        tagsList:[...otherRouter.children],
        menuList:[],
        pageOpenedList:[{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ], // 面包屑数组
        cachePage: [],
        openedSubmenuArr: [],  // 要展开的菜单数组
        dontCache: []  // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    getters: {

    },
    mutations: {
        setLoadingStatus(state,status){
            state.loading = status;
        },
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
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            router.push({
                name: 'home_index'
            });
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
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

//全局过滤器
Vue.filter('dateFormat', function (value,type) {
    if (!value) return '';
    return Util.formatDate(new Date(value),type);
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