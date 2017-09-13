<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
    }
    .layout-content{
        min-height: 580px;
        height: 100%;
        margin: 0px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
</style>
<template>
    <div class="layout">
        <lh-header></lh-header>
        <div class="layout-content" >
            <router-view></router-view>
        </div>
        <lh-footer></lh-footer>
    </div>
</template>
<script>
    import LhHeader from './header.vue'
    import LhFooter from './footer.vue'

    export default {
        name:'Index',
        components:{
            LhHeader,
            LhFooter
        }
    }
</script>
