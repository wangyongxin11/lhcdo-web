<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': hideMenuText}">
        <div class="sidebar-menu-con" :style="{width: hideMenuText?'60px':'200px', overflow: hideMenuText ? 'visible' : 'auto', background: $store.state.menuTheme === 'dark'?'#495060':'white'}">
            <div class="logo-con">
                <img v-show="!hideMenuText"  src="../../assets/image/logo.png" key="max-logo" />
                <img v-show="hideMenuText" src="../../assets/image/logo.png" key="min-logo" />
            </div>
            <sidebar-menu v-if="!hideMenuText" :menuList="menuList" :iconSize="14"/>
            <sidebar-menu-shrink :icon-color="menuIconColor" v-else :menuList="menuList"/>
        </div>
        <div class="main-header-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <!--<div class="switch-theme-con">
                        <Row class="switch-theme" type="flex" justify="center" align="middle">
                            <theme-dropdown-menu></theme-dropdown-menu>
                        </Row>
                    </div>-->
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ username }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <!--<DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="logout" divided>退出登录</DropdownItem>-->
                                    <DropdownItem name="logout">退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar icon="person" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: hideMenuText?'60px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
    import sidebarMenu from './main_components/sidebarMenu.vue';
    import tagsPageOpened from './main_components/tagsPageOpened.vue';
    import breadcrumbNav from './main_components/breadcrumbNav.vue';
    import themeDropdownMenu from './main_components/themeDropdownMenu.vue';
    import sidebarMenuShrink from './main_components/sidebarMenuShrink.vue';
    import {removeToken} from '@/libs/auth.js';
    import util from '@/libs/util.js';
    
    export default {
        components: {
            sidebarMenu,
            tagsPageOpened,
            breadcrumbNav,
            themeDropdownMenu,
            sidebarMenuShrink
        },
        data () {
            return {
                spanLeft: 4,
                spanRight: 20,
                currentPageName: '',
                hideMenuText: false
            };
        },
        computed: {
            menuList () {
                return this.$store.state.menuList;
            },
            tagsList () {
                return this.$store.state.tagsList;  // 所有页面的页面对象
            },
            pageTagsList () {
                return this.$store.state.pageOpenedList;  // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.currentPath;  // 当前面包屑数组
            },
            menuIconColor () {
                return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.cachePage;
            },
            username(){
                let user = this.$store.state.user;
                if(user==null){
                    user = JSON.parse(localStorage.getItem('user'));
                }
                let name = '';
                if(user){
                    this.$store.commit('changeUser',{
                        user:user
                    });
                    name = user.displayName;
                }
                return name;
            }
        },
        methods: {
            init () {
                this.$store.commit('setCurrentPageName', this.$route.name);
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(this.$route.name);
            },
            toggleClick () {
                this.hideMenuText = !this.hideMenuText;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'logout') {
                    // 退出登录
                    let _this = this;
                    util.ajax.get('user/logout').then(function(res){
                        if(res.data){
                            if('1' == res.data.statusCode){
                                removeToken();
                                _this.$store.commit('clearOpenedSubmenu');
                                _this.$store.commit('changeUser',{user:null});
                                localStorage.clear();
                                _this.$router.push({
                                    name: 'login'
                                });
                            }else {
                                let content = '';
                                if(res.data.statusInfo){
                                    content = '退出失败,'+res.data.statusInfo;
                                }else {
                                    content = '退出失败';
                                }
                                _this.$Modal.error({
                                    title: '错误',
                                    content:content
                                });
                            }
                        }
                    }).catch(function (err) {
                        console.log(err);
                        _this.$Modal.error({
                            title: '错误',
                            content: '退出失败'
                        });
                    });
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) {  //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
            }
        },
        mounted () {
            this.init();
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        }
    };
</script>
