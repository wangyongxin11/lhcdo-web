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
                        name:'组合资产风险分析',
                        path:'calDefaultRate',
                        iconType:'ios-analytics'
                    }
                ]
            };
        },
        methods:{
            gotoPage:(val)=>{
                this.selectedMenu=val;
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
</style>