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
                    <Row class="action-area">
                        <Col span="4">
                            <Input v-model="portfolio.portfolioName" placeholder="请输入交易名称..." icon="ios-search"></Input>
                        </Col>
                        <!--<Col span="4">
                        <Dropdown style="margin-left: 20px">
                            <Button type="primary">
                                项目状态
                                <Icon type="arrow-down-b"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                            <DropdownItem>未进行</DropdownItem>
                            <DropdownItem>已完成</DropdownItem>
                        </DropdownMenu>
                        </Dropdown>
                        </Col>-->
                        <Col span="20">
                            <div class="button-group">
                                <div style="margin-right: 5px;display: inline-block">
                                    <span>只看自己</span>
                                    <Switch @on-change="changeSelfFlag">
                                        <Icon type="android-done" slot="open"></Icon>
                                        <Icon type="android-close" slot="close"></Icon>
                                    </Switch>
                                </div>
                                <!--<Button type="primary">显示其他字段</Button>-->
                                <Button style="margin-right: 5px" type="primary" @click="showAddPortfolio = true"><Icon type="android-add"></Icon> 新建资产池</Button>
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
        <Modal width="70" v-model="showAddPortfolio" title="新建资产池" :mask-closable="false">
            <PortfolioForm ref="portfolioForm"></PortfolioForm>
            <div slot="footer"></div>
        </Modal>
        <Modal width="30" v-model="showSelectModel" title="计算模型选择" :closable="openClose" :mask-closable="false">
            <div style="text-align:center">
                <Select @on-change="isShowTip" v-model="simulationRecord.attachableType"  style="width:200px">
                    <Option v-for="item in modelList" :value="item.code" :key="item.id">{{ item.name }}</Option>
                </Select>
                <span v-if="showTip" style="display: inline-block;color: red;width: 100%;">请选择计算模型</span>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="primary" :loading="simulating" @click="beginSimulate">计算</Button>
            </div>
        </Modal>
        <Modal width="30" v-model="showNumModal" title="模拟次数" @on-ok="simulate('assetCreditAnalysis/analysis')" :mask-closable="false">
            <div style="text-align: center;">
                模拟次数<InputNumber style="width: 200px;margin-left: 10px" :max="1000" :min="1" :step="10" v-model="simulationRecord.num"></InputNumber>(万次)
            </div>
        </Modal>
        <div class="layout-copy">
            2017-2022 &copy; 联合信用评级
        </div>
    </div>
</template>
<script>
    import Util from '../../libs/util';
    import PortfolioForm from '../business/components/portfolioForm.vue';
    import LargeAmountTable from '../business/components/largeAmountTestResultTable.vue';

    export default {
        components:{
            PortfolioForm,
            LargeAmountTable
        },
        data () {
            return {
                modelList: [{
                    id:1,
                    name:'组合资产违约风险模拟',
                    code:'portfolio'
                }, {
                    id:2,
                    name:'大额测试',
                    code:'large_amount'
                }],
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
                            }, '详情');
                            let calBtn = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.chooseOperation(params.row.id);
                                    }
                                }
                            }, '计算');
                            let delBtn = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.row.id);
                                    }
                                }
                            }, '删除');
                            let userId = this.$store.state.user.id;
                            if(params.row.user&&params.row.user.id === userId){
                                return h('div', [detailBtn,calBtn,delBtn]);
                            }else {
                                return h('div', [detailBtn,calBtn]);
                            }
                        }
                    }
                ],
                portfolio:{
                    userId:null,
                    portfolioName:'',
                },
                pageInfo: {},
                showAddPortfolio:false,
                isSelfFlag:false,
                showSelectModel:false,
                simulationRecord:{
                    num: 20,
                    attachableId:'',
                    attachableType: '',
                    summaryType:2,
                    userId:null
                },
                showTip:false,
                openClose:true,
                simulating:false,
                showNumModal:false
            };
        },
        methods: {
            closeAddModal(){
                this.showAddPortfolio = false;
                this.pageInfo = this.queryPortfolioList();
            },
            show (index) {
                this.$Modal.info({
                    title: '计算模型选择',
                    content: `项目名称：${this.pageInfo.data[index].project}<br>交易名称：${this.pageInfo.data[index].business}<br>创建人：${this.pageInfo.data[index].founder}`
                });
            },
            chooseOperation(index){
                this.showSelectModel = true;
                this.simulationRecord.attachableId = index;
            },
            remove (index) {
                let _this = this;
                this.$Modal.confirm({
                    title:'删除确认',
                    content:'确定要删除此资产池信息',
                    onOk:()=>{
                        Util.ajax.delete('assetCreditAnalysis/portfolio/'+index).then(function(res){
                            if(res.data){
                                if('1' == res.data.statusCode){
                                    _this.queryPortfolioList();
                                }else {
                                    let content = '';
                                    if(res.data.statusInfo){
                                        content = +res.data.statusInfo;
                                    }else {
                                        content = '删除失败';
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
                                content: '删除失败'
                            });
                        });
                    }
                });
            },
            isShowTip(val){
                if(val!=''){
                    this.showTip = false;
                }
            },
            changePage (pageNo) {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.queryPortfolioList(pageNo,this.pageInfo.pageSize==null?10:this.pageInfo.pageSize);
            },
            changePageSize(pageSize){
                this.queryPortfolioList(this.pageInfo.pageNo==null?1:this.pageInfo.pageNo,pageSize);
            },
            changeSelfFlag(status){
                this.isSelfFlag = status;
                this.queryPortfolioList(1,10);
            },
            queryPortfolioList(pageNo,pageSize){
                if(this.isSelfFlag){
                    this.portfolio.userId = this.$store.state.user.id;
                }else {
                    this.portfolio.userId = null;
                }
                let req = {};
                req.pageNo = pageNo==null?1:pageNo;
                req.pageSize = pageSize==null?10:pageSize;
                req.query = this.portfolio;
                let _this = this;
                Util.ajax.post('assetCreditAnalysis/portfolioList',req).then(function(res){
                    if(res.data){
                        if('1' == res.data.statusCode){
                            if(res.data.data){
                                _this.pageInfo = res.data.data;
                            }else {
                                _this.pageInfo = {};
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
            },
            beginSimulate () {
                if(this.simulationRecord.attachableType==''){
                    this.showTip = true;
                    return;
                }else {
                    this.showTip = false;
                }
                if(this.simulationRecord.attachableType==='portfolio'){
                    this.showNumModal = true;
                }else if(this.simulationRecord.attachableType==='large_amount') {
                    this.calLargeAmount();
                }
            },
            simulate(url){
                this.openClose = false;
                this.simulating = true;
                this.simulationRecord.userId = this.$store.state.user.id;
                let _this = this;
                Util.ajax.post(url,this.simulationRecord).then(function(res){
                    if(res.data){
                        if('0' == res.data.statusCode){
                            let content = '';
                            if(res.data.statusInfo){
                                content = '计算过程出错:'+res.data.statusInfo;
                            }else {
                                content = '计算过程出错,请排查数据';
                            }
                            _this.$Modal.error({
                                title: '错误',
                                content:content
                            });
                        }else {
                            _this.showSelectModel = false;
                            if(_this.simulationRecord.attachableType==='portfolio'){
                                let args = { portfolioId: _this.simulationRecord.attachableId};
                                Util.openNewPage(_this, 'simulationRecordList', args);
                                _this.$router.push({
                                    name: 'simulationRecordList',
                                    params: args
                                });
                            }
                        }
                        _this.simulating = false;
                    }
                    _this.openClose = true;
                }).catch(function (err) {
                    _this.$Modal.error({
                        title: '错误',
                        content: '计算过程出错'
                    });
                    _this.simulating = false;
                    _this.openClose = true;
                });
            },
            calLargeAmount () {
                this.openClose = false;
                this.simulating = true;
                let _this = this;
                Util.ajax.get('largeAmountTest/calculateAllLevel/'+this.simulationRecord.attachableId).then(function(res){
                    if(res.data){
                        if('0' == res.data.statusCode){
                            let content = '';
                            if(res.data.statusInfo){
                                content = '计算过程出错:'+res.data.statusInfo;
                            }else {
                                content = '计算过程出错,请排查数据';
                            }
                            _this.$Modal.error({
                                title: '错误',
                                content:content
                            });
                        }else {
                            _this.showSelectModel = false;
                            _this.$Modal.info({
                                title:'大额测试计算结果',
                                width:70,
                                scrollable:true,
                                render:h=>{
                                    return h(LargeAmountTable,{
                                        props:{
                                            results:res.data.data
                                        }
                                    });
                                }
                            });
                        }
                        _this.simulating = false;
                    }
                    _this.openClose = true;
                }).catch(function (err) {
                    _this.$Modal.error({
                        title: '错误',
                        content: '计算过程出错'
                    });
                    _this.simulating = false;
                    _this.openClose = true;
                });
            }
        },
        mounted(){
            this.queryPortfolioList(1,10);
        }
    };
</script>