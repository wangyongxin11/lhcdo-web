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
                    <Row :gutter="16" style="margin-bottom: 10px;">
                        <Col span="8">交易名称：{{portfolioDetail.portfolioName}}</Col>
                        <Col span="8">保证金：{{portfolioDetail.reservesMoney}}</Col>
                        <Col span="8">相关系数乘数：{{portfolioDetail.multiplier}}</Col>
                    </Row>
                    <Row :gutter="16">
                        <Col span="8">初始起算日：{{portfolioDetail.beginCalculateDate|dateFormat(1)}}</Col>
                        <Col span="8">发起机构：{{portfolioDetail.sponsorName}}</Col>
                    </Row>
                </div>
                <Tabs v-model="operateTabName" type="card">
                    <TabPane label="资产池信息" name="assetPool">
                        <can-edit-table refs="assetPool" :loading="loading" v-model="loanRecordList" :columns-list="portfolioTitleList" :saveEdit="saveEditInCell"></can-edit-table>
                    </TabPane>
                    <TabPane label="分期摊还信息" name="amortization">
                        <can-edit-table refs="amortization" v-model="amortizationData" :loading="loading" :columns-list="amortizationTitleList" :saveEdit="saveEditInCell"></can-edit-table>
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
    import canEditTable from '../../components/canEditTable.vue';

    const operateTitleSettings = {
        title: '操作',
        align: 'center',
        fixed:'right',
        width: 100,
        key: 'handle',
        handle: ['edit']
    };

    const amortizeProperties = ['id','portfolioId','loanSerial','amortize','amortization'];

    export default {
        components:{
            canEditTable
        },
        data () {
            return {
                portfolioTitleList: [
                    {
                        title: '贷款编号',
                        fixed: 'left',
                        key:'loanSerial',
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '借款人编号',
                        key: 'borrowerSerial',
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '行业代码',
                        key: 'industryCode',
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '信用等级',
                        key: 'creditLevel',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '贷款到期日',
                        key: 'maturityDate',
                        width:100,
                        align: 'center',
                        render:(h,params)=>{
                            let date = new Date(params.row.maturityDate);
                            return h('span',Util.formatDate(date,1));
                        }
                    },
                    {
                        title: '贷款余额',
                        key: 'loanBalance',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '贷款利率',
                        key: 'lendingRate',
                        width:100,
                        align: 'center',
                        editable: true,
                        render:(h,params)=>{
                            return h('span',params.row.lendingRate+'%');
                        }
                    },
                    {
                        title: '分期摊还',
                        key: 'amortize',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '资产自身回收率',
                        key: 'assetSelfRecoveryRate',
                        width:100,
                        align: 'center',
                        editable: true,
                        render:(h,params)=>{
                            let rate = params.row.assetSelfRecoveryRate * 100;
                            return h('span',rate+'%');
                        }
                    },
                    {
                        title: '借款人地区',
                        key: 'borrowerArea',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '贷款发放日',
                        key: 'loanProvideDate',
                        width:100,
                        align: 'center',
                        render:(h,params)=>{
                            let date = new Date(params.row.loanProvideDate);
                            return h('span',Util.formatDate(date,1));
                        }
                    },
                    {
                        title: '担保方式',
                        key: 'guaranteeMode',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '(级别最高）担保机构名称',
                        key: 'guaranteeName',
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '担保机构责任形式',
                        key: 'liabilityForm',
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '担保比率',
                        key: 'guaranteeRatio',
                        width:100,
                        align: 'center',
                        editable: true,
                        render:(h,params)=>{
                            let rate = params.row.guaranteeRatio;
                            if(rate==0){
                                rate = '';
                            }
                            return h('span',rate);
                        }
                    },
                    {
                        title: '担保机构最高信用等级',
                        key: 'guaranteeCreditLevel',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '担保机构行业代码',
                        key: 'guaranteeIndustryCode',
                        width:100,
                        align: 'center',
                        editable: true,
                        render:(h,params)=>{
                            let val = params.row.guaranteeIndustryCode;
                            if(val == 0){
                                val = '';
                            }
                            return h('span',val);
                        }
                    },
                    {
                        title: '担保机构地区',
                        key: 'guaranteeBelongArea',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '保证人个数',
                        key: 'guaranteeNum',
                        width:100,
                        align: 'center',
                        editable: true,
                        render:(h,params)=>{
                            let val = params.row.guaranteeNum;
                            if(val == 0){
                                val = '';
                            }
                            return h('span',val);
                        }
                    },
                    {
                        title: '借款人行业',
                        key: 'borrowerIndustry',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '借款人名称',
                        key: 'borrowerName',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '担保机构行业',
                        key: 'guaranteeAgentIndustry',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '借款人保证人相关系数',
                        key: 'relevanceForGuaranteeAndLender',
                        width:100,
                        align: 'center',
                        editable: true
                    },
                    {
                        title: '抵押物回收率',
                        key: 'mortgageRecoveryRate',
                        width:100,
                        align: 'center',
                        editable: true,
                        render:(h,params)=>{
                            let rate = params.row.mortgageRecoveryRate * 100;
                            return h('span',rate+'%');
                        }
                    },
                    {
                        title: '债项级别',
                        key: 'debtLevel',
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '违约放大倍数',
                        key: 'defaultMagnification',
                        width:100,
                        align: 'center',
                        render:(h,params)=>{
                            let debtLevel = params.row.debtLevel;
                            if(debtLevel){
                                return h('span',params.row.defaultMagnification);
                            }else{
                                return h('span','');
                            }

                        }
                    },
                    {
                        title: '考虑保证人的回收率',
                        key: 'guaranteeRecoveryRate',
                        width:100,
                        align: 'center',
                        render:(h,params)=>{
                            let debtLevel = params.row.debtLevel;
                            if(debtLevel){
                                let rate = params.row.guaranteeRecoveryRate * 100;
                                return h('span',rate+'%');
                            }else{
                                return h('span','');
                            }
                        }
                    },
                    {
                        title: '最终回收率',
                        key: 'finalRecoveryRate',
                        width:100,
                        align: 'center',
                        render:(h,params)=>{
                            let debtLevel = params.row.debtLevel;
                            if(debtLevel){
                                let rate = params.row.finalRecoveryRate * 100;
                                return h('span',rate+'%');
                            }else{
                                return h('span','');
                            }
                        }
                    },
                    {
                        title: '累计违约率',
                        key: 'totalDefaultRate',
                        width:100,
                        align: 'center',
                        render:(h,params)=>{
                            let debtLevel = params.row.debtLevel;
                            if(debtLevel){
                                let rate = params.row.totalDefaultRate * 100;
                                return h('span',rate+'%');
                            }else{
                                return h('span','');
                            }
                        }
                    }
                ],
                portfolioDetail: {},
                loanRecordList:[],
                amortizationTitleList:[],
                amortizationData:[],
                operateTabName:'assetPool',
                loading:true
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
                                    let portfolioInfo = res.data.data;
                                    _this.portfolioDetail = portfolioInfo;
                                    if(portfolioInfo.userId===_this.$store.state.user.id){
                                        if(_this.portfolioTitleList.indexOf(operateTitleSettings)===-1){
                                            _this.portfolioTitleList.push(operateTitleSettings);
                                        }
                                    }else {
                                        if(_this.portfolioTitleList.indexOf(operateTitleSettings)!==-1){
                                            _this.portfolioTitleList.pop(operateTitleSettings);
                                        }
                                    }
                                    _this.loanRecordList = portfolioInfo.recordList.map(item=>{
                                        let loanRecord = {};
                                        if(item.debtorInfo.amortize){
                                            item.debtorInfo.amortize = '是';
                                        }else {
                                            item.debtorInfo.amortize = '否';
                                        }
                                        item.debtorInfo.debtInfoId = item.debtorInfo.id;
                                        item.guarantorInfo.guarantorInfoId = item.guarantorInfo.id;
                                        Object.assign(loanRecord,item.debtorInfo,item.guarantorInfo);
                                        return loanRecord;
                                    });
                                    let amortization = portfolioInfo.amortization;
                                    if(amortization){
                                        let amortizationDateStr = amortization.amortizationDate.split(',');
                                        let amortizationTitles = amortizationDateStr.map((item)=>{
                                            let header = {};
                                            header.title = item;
                                            header.editable = true;
                                            header.width = 102;
                                            header.key = item;
                                            return header;
                                        });
                                        if(portfolioInfo.userId===_this.$store.state.user.id){
                                            amortizationTitles.push(operateTitleSettings);
                                        }
                                        let clonedPortfolioTitleList = JSON.parse(JSON.stringify(_this.portfolioTitleList));
                                        let loanSerialList = clonedPortfolioTitleList.slice(0,1);
                                        _this.amortizationTitleList = loanSerialList
                                            .concat(clonedPortfolioTitleList.slice(7,8).map(item=>{
                                                item.fixed = 'left';
                                                item.editable = false;
                                                return item;
                                            })).concat(amortizationTitles);
                                        let amortizeList = portfolioInfo.recordList.map(item=>{
                                            return item.debtorInfo.amortize;
                                        });
                                        _this.amortizationData = amortization.amortizationInfoList.map((item,index)=>{
                                            let amortizationArr = item.amortization.split(',');
                                            amortizationDateStr.forEach((val,index)=>{
                                                _this.$set(item,val,amortizationArr[index]);
                                            });
                                            item.amortize = amortizeList[index];
                                            return item;
                                        });
                                    }
                                }
                            }else {
                                let content = '';
                                if(res.data.statusInfo){
                                    content = res.data.statusInfo;
                                }else {
                                    content = '查看详情失败';
                                }
                                _this.$Modal.error({
                                    title: '错误',
                                    content:content
                                });
                            }
                        }
                        _this.loading = false;
                    }).catch(function (err) {
                        _this.loading = false;
                        _this.$Modal.error({
                            title: '错误',
                            content: '查看详情失败'
                        });
                    });
                }
            },
            clearData(){
                this.portfolioDetail = {};
                this.loanRecordList=[];
                this.amortizationTitleList=[];
                this.amortizationData=[];
                this.loading = true;
                this.operateTabName = 'assetPool';
            },
            saveEditInCell (index, success, fail) {
                success(()=>{
                    let updateRecord,url;
                    if(this.operateTabName==='assetPool'){
                        updateRecord = JSON.parse(JSON.stringify(this.loanRecordList[index]));
                        if(updateRecord.amortize==='是'){
                            updateRecord.amortize = true;
                        }else {
                            updateRecord.amortize = false;
                        }
                        url = '/assetCreditAnalysis/updatePortfolio';
                    }else {
                        let obj = this.amortizationData[index];
                        let amortizeStr = '';
                        for(let prop in obj){
                            if(amortizeProperties.indexOf(prop)===-1){
                                amortizeStr += obj[prop]+',';
                            }
                        }
                        updateRecord = {};
                        updateRecord.id = obj.id;
                        updateRecord.portfolioId = obj.portfolioId;
                        updateRecord.amortization = amortizeStr.substr(0,amortizeStr.length-1);
                        updateRecord.loanSerial = obj.loanSerial;
                        url = '/assetCreditAnalysis/updateAmortization';
                    }
                    if(updateRecord){
                        Util.ajax.post(url,updateRecord).then(res=>{
                            if(res.data.statusCode=='1'){
                                this.$Message.success('修改成功');
                                this.queryPortfolioDetail();
                            }else {
                                fail(()=>{
                                    let content = '';
                                    if(res.data.statusInfo){
                                        content = res.data.statusInfo;
                                    }else {
                                        content = '修改失败';
                                    }
                                    this.$Modal.error({
                                        title: '错误',
                                        content:content
                                    });
                                });
                            }
                        }).catch(err=>{
                            fail(()=>{
                                this.$Modal.error({
                                    title: '错误',
                                    content: '修改失败'
                                });
                            });
                        });
                    }
                });
            }
        },
        created(){
            this.clearData();
            this.queryPortfolioDetail();
        },
        watch: {
            '$route' () {
                this.clearData();
                this.queryPortfolioDetail();
            }
        }
    };
</script>
