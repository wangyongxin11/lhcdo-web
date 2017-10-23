<template>
    <Menu mode="horizontal" @on-select="gotoPage" theme="dark" :active-name="selectedMenu" class="lh-header">
        <div class="layout-logo">联合信用评级</div>
        <div class="layout-nav">
            <div v-for="item in menuList" >
                <router-link :to="item.path">
                    <Menu-item :name="item.id">
                        <Icon :type="item.iconType"></Icon>
                        {{item.name}}
                    </Menu-item>
                </router-link>
            </div>
        </div>
        <div class="layout-ceiling-main">
            <span style="color: #ffffff"><Icon type="ios-person-outline" class="role-icon"></Icon>{{username}}</span>
            <Button type="primary" @click="logout">退出登录</Button>
        </div>
    </Menu>
</template>
<script>
    import { removeToken } from '../../libs/auth';
    import Util from '../../libs/util';

    export default {
        name:'LhHeader',
        data:()=>{
            return {
                selectedMenu:null,
                menuList:[
                    {
                        id:1,
                        name:'组合资产风险分析',
                        path:'calDefaultRate',
                        iconType:'ios-analytics'
                    }
                ]
            };
        },
        methods:{
            gotoPage(val){
                this.selectedMenu=val;
            },
            logout(){
                let _this = this;
                Util.ajax.get('user/logout').then(function(res){
                    if(res.data){
                        if('1' == res.data.statusCode){
                            removeToken();
                            _this.$store.commit('changeUser',{user:null});
                            localStorage.clear();
                            _this.$router.push({path:'/login'});
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
                    _this.$Modal.error({
                        title: '错误',
                        content: '退出失败'
                    });
                });
            }
        },
        computed:{
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
        }
    };
</script>
<style scoped>
    .lh-header{
        height: 80px;
        line-height: 80px;
    }
    .layout-logo{
        width: 100px;
        height: 40px;
        background-color: #9ea7b4;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 20px;
        left: 20px;
        margin-right: 20px;
        line-height: 40px;
        text-align: center;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
    }
    .layout-ceiling-main button{
        margin-left: 10px;
    }
    .role-icon{
        border: 1px solid #57a3f3;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        text-align: center;
        line-height: 24px;
        font-size: 22px;
        color: #57a3f3;
        margin-right: 5px;
        position: absolute;
        top: 27px;
        right: 144px;
    }
</style>