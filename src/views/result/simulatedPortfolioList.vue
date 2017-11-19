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
    .action-area{
        margin: 10px auto;
    }
    .action-area .button-group{
        float: right;
    }
</style>
<template>
    <div class="layout">
        <Row type="flex">
            <Col span="24">
            <div class="layout-content">
                <Row class="action-area" :gutter="16">
                    <Col span="4">
                    <Input v-model="portfolio.portfolioName" @on-click="queryPortfolioList(1,10)" @on-enter="queryPortfolioList(1,10)" icon="search" placeholder="请输入交易名称..."></Input>
                    </Col>
                    <Col span="20">
                        <div class="button-group">
                            <div style="margin-right: 5px;display: inline-block">
                                <span>只看自己</span>
                                <Switch @on-change="changeSelfFlag">
                                    <Icon type="android-done" slot="open"></Icon>
                                    <Icon type="android-close" slot="close"></Icon>
                                </Switch>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Table stripe :columns="titleList" :data="pageInfo==null?[]:pageInfo.data"></Table>

                <div style="margin: 10px;overflow: hidden" v-if="pageInfo&&pageInfo.data&&pageInfo.data.length>0">
                    <div style="float: right;">
                        <Page :total="pageInfo.totalRecords" :current="pageInfo.pageNo" :page-size="pageInfo.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer show-total></Page>
                    </div>
                </div>
            </div>
            </Col>
        </Row>
        <div class="layout-copy">
            2017-2022 &copy; 联合信用评级
        </div>
    </div>
</template>
<script>
    import Util from '../../libs/util';
    import PortfolioForm from '../business/components/portfolioForm.vue';

    export default {
        components:{
            PortfolioForm
        },
        data () {
            return {
                titleList: [
                    {
                        title: '编号',
                        render:(h,params)=>{
                            return h('div',[
                                h('span',(this.pageInfo.pageNo-1)*this.pageInfo.pageSize+params.index+1),
                                h('input',{
                                    attrs:{
                                        type:'hidden',
                                        value:params.row.id
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '交易名称',
                        key: 'portfolioName'
                    },
                    {
                        title: '创建人',
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
                        title: '已模拟次数',
                        key: 'simulationNum',
                    },
                    {
                        title: '创建日期',
                        key: 'createTime',
                        sortable: true,
                        render:(h,params)=>{
                            let date = new Date(params.row.createTime);
                            return h('span',Util.formatDate(date));
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 300,
                        align: 'left',
                        render: (h, params) => {
                            let detailBtn = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.show(params.row.id);
                                    }
                                }
                            }, '查看');
                            let download = h('a', {
                                attrs: {
                                    href: Util.serverUrl+'/assetCreditAnalysis/download/'+params.row.id,
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    }
                                }, '下载最新结果')
                            ]);
                            return h('div', [detailBtn,download]);
                        }
                    }
                ],
                portfolio:{
                    userId:null,
                    portfolioName:'',
                },
                pageInfo: {},
                isSelfFlag:false
            };
        },
        methods: {
            show(id) {
                let args = { portfolioId: id };
                Util.openNewPage(this, 'simulationRecordList', args);
                this.$router.push({
                    name: 'simulationRecordList',
                    params: args
                });
            },
            changePage(pageNo) {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.queryPortfolioList(pageNo, this.pageInfo.pageSize == null ? 10 : this.pageInfo.pageSize);
            },
            changePageSize(pageSize) {
                this.queryPortfolioList(this.pageInfo.pageNo == null ? 1 : this.pageInfo.pageNo, pageSize);
            },
            changeSelfFlag(status) {
                this.isSelfFlag = status;
                this.queryPortfolioList(1,10);
            },
            queryPortfolioList(pageNo, pageSize) {
                if (this.isSelfFlag) {
                    this.portfolio.userId = this.$store.state.user.id;
                } else {
                    this.portfolio.userId = null;
                }
                let req = {};
                req.pageNo = pageNo == null ? 1 : pageNo;
                req.pageSize = pageSize == null ? 10 : pageSize;
                req.query = this.portfolio;
                let _this = this;
                Util.ajax.post('simulationRecord/portfolioList', req).then(function (res) {
                    if (res.data) {
                        if ('1' == res.data.statusCode) {
                            if (res.data.data) {
                                _this.pageInfo = res.data.data;
                            } else {
                                _this.pageInfo = {};
                            }
                        } else {
                            let content = '';
                            if (res.data.statusInfo) {
                                content = res.data.statusInfo;
                            } else {
                                content = '查询失败';
                            }
                            _this.$Modal.error({
                                title: '错误',
                                content: content
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
        },
        mounted(){
            this.queryPortfolioList(1,10);
        }
    };
</script>