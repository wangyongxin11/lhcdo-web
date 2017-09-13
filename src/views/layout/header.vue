<template>
    <Menu mode="horizontal" @on-select="gotoPage" theme="dark" :active-name="selectedMenu" class="lh-header">
        <div class="layout-logo">联合信用评级</div>
        <div class="layout-nav">
            <div v-for="item in menuList" >
                <router-link v-if="!item.subMenu" :to="item.path">
                    <Menu-item :name="item.id">
                        <Icon :type="item.iconType"></Icon>
                        {{item.name}}
                    </Menu-item>
                </router-link>
                <Submenu v-else="item.subMenu" :name="item.id">
                    <template slot="title">
                        <Icon :type="item.iconType"></Icon>
                        {{item.name}}
                    </template>
                    <div v-for="child in item.subMenu">
                        <router-link  :to="child.path">
                            <Menu-item  :name="child.id">
                                <Icon :type="child.iconType"></Icon>
                                {{child.name}}
                            </Menu-item>
                        </router-link>
                    </div>
                </Submenu>
            </div>
        </div>
        <div class="layout-right">
            <Dropdown >
                <a href="javascript:void(0)" class="lh-dropdown-a">
                        <Avatar icon="person" />
                    当前用户
                </a>
                <Dropdown-menu slot="list" class="dropdown-main">
                    <Dropdown-item class="dropdown-item">驴打滚</Dropdown-item>
                    <Dropdown-item class="dropdown-item">炸酱面</Dropdown-item>
                    <Dropdown-item class="dropdown-item" disabled>豆汁儿</Dropdown-item>
                    <Dropdown-item class="dropdown-item">冰糖葫芦</Dropdown-item>
                    <Dropdown-item class="dropdown-item" divided>北京烤鸭</Dropdown-item>
                </Dropdown-menu>
            </Dropdown>
        </div>
    </Menu>
</template>
<script>
    export default {
        name:'LhHeader',
        data:()=>{
            return {
                selectedMenu:null,
                menuList:[
                    {
                        id:1,
                        name:'驾驶舱管理',
                        path:'calDefaultRate',
                        iconType:'ios-navigate'
                    },
                    {
                        id:2,
                        name:'经营分析',
                        path:'cockpit',
                        iconType:'ios-keypad'
                    },
                    {
                        id:3,
                        name:'销售分析',
                        path:'cockpit',
                        iconType:'ios-analytics'
                    },
                    {
                        id:4,
                        name:'客户分析',
                        path:'',
                        iconType:'ios-paper'
                    },
                    {
                        id:5,
                        name:'财务分析',
                        path:'',
                        iconType:'ios-navigate'
                    },
                    {
                        id:6,
                        name:'客户全景',
                        path:'',
                        iconType:'ios-navigate',
                        subMenu:[
                            {
                                id:61,
                                name:'统一视图',
                                path:'',
                                iconType:'ios-navigate'
                            },
                            {
                                id:62,
                                name:'流失客户',
                                path:'',
                                iconType:'ios-navigate'
                            }
                        ]
                    },
                    {
                        id:7,
                        name:'舆情分析',
                        path:'',
                        iconType:'ios-navigate'
                    }
                ]
            }
        },
        methods:{
            gotoPage:(val)=>{
                this.selectedMenu=val;
                console.log(this.selectedMenu);
            }
        }
    }
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
    .dropdown-main{
        min-width: 120px;
    }
    .dropdown-item{
        padding: 0;
        height: 30px;
        line-height: 30px;
    }
    .layout-right{
        padding-right: 10px;
        width: 110px;
        float: right;
        line-height: 80px;
        text-align: center;
    }
    .lh-dropdown-a{
        color: #9ea7b4;
    }
    .lh-dropdown-a:hover{
        color: #ffffff;
    }
</style>