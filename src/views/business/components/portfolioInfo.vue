<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-content">
            <Card>
                <p slot="title">资产池基础信息</p>
                <div style="margin-bottom: 30px">
                    <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
                </div>
                <Tabs value="assetPool" type="card">
                    <TabPane label="资产池信息" name="assetPool">
                        <Table stripe border :height="400" :columns="portfolioTitleList" :data="portfolioDetail.recordList==null?[]:portfolioDetail.recordList"></Table>
                    </TabPane>
                    <TabPane label="分期摊还信息" name="amortization">
                        <Table stripe border :height="400" :columns="amortizationTitleList" :data="amortizationData"></Table>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
        <div class="layout-copy">
            2017-2022 &copy; 联合信用评级
        </div>
    </div>
</template>
<script>
    import Util from '@/libs/util.js';

    export default {
        data () {
            return {
                portfolioTitleList: [
                    {
                        type:'index',
                        title: '编号'
                    },
                    {
                        title: '操作人',
                        key: 'user.displayName',
                        render:(h,params)=>{
                            let username = '';
                            if(params.row.user){
                                username = params.row.user.displayName;
                            }
                            return h('span',username);
                        }
                    },
                    {
                        title: '模拟次数',
                        key: 'num',
                        render:(h,params)=>{
                            return h('span',params.row.num+'万次');
                        }
                    },
                    {
                        title: '计算完成时间',
                        key: 'createTime',
                        sortable: true,
                        render:(h,params)=>{
                            let date = new Date(params.row.createTime);
                            return h('span',Util.formatDate(date));
                        }
                    },
                    {
                        title: '计算耗时',
                        key: 'consumeTime',
                        render:(h,params)=>{
                            let hour = 0;
                            let min = 0;
                            let sec = 0;
                            let seconds = params.row.consumeTime/1000;
                            if(seconds>=3600){
                                hour = Math.floor(seconds/3600);
                                let mins = seconds - 3600*hour;
                                min = Math.floor(mins/60);
                                sec = Math.ceil(seconds - 3600*hour-min*60);
                            }else if(seconds<60){
                                sec = Math.ceil(seconds);
                            }else {
                                min = Math.floor(seconds/60);
                                sec = Math.ceil(seconds - min * 60);
                            }
                            let time = '';
                            if(hour>0){
                                time += hour+'小时';
                            }
                            if(min>0){
                                time += min + '分';
                            }
                            if(sec>0){
                                time += sec + '秒';
                            }
                            return h('span',time);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 300,
                        align: 'left',
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: Util.serverUrl+'/assetCreditAnalysis/result/'+params.row.resultId,
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    }
                                }, '结果下载')
                            ]);
                        }
                    }
                ],
                portfolioDetail: {},
                amortizationTitleList:[],
                amortizationData:[]
            };
        },
        methods: {
            queryPortfolioDetail(){
                let portfolioId = parseInt(this.$route.params.portfolioId);
                let _this = this;
                if(!isNaN(portfolioId)){
                    Util.ajax.get('assetCreditAnalysis/portfolio/'+portfolioId).then(function(res){
                        if(res.data){
                            if('1' == res.data.statusCode){
                                if(res.data.data){
                                    _this.portfolioDetail = res.data.data;
                                }
                            }else {
                                let content = '';
                                if(res.data.statusInfo){
                                    content = +res.data.statusInfo;
                                }else {
                                    content = '查询失败';
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
                            content: '查询失败'
                        });
                    });
                }
            }
        },
        mounted(){
            this.queryPortfolioDetail();
        },
        watch: {
            '$route' () {
                this.queryPortfolioDetail();
            }
        }
    };
</script>
