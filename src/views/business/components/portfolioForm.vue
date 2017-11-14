<template>
    <div>
        <Row :gutter="16">
            <Col span="24">
            <Card dis-hover>
                <Form ref="assetPoolForm" :model="assetPool" :rules="assetPoolRules" :label-width="100">
                    <Row>
                        <Col span="12">
                        <FormItem label="交易名称" prop="portfolioName">
                            <Input v-model="assetPool.portfolioName" placeholder="请输入" style="width: 200px"></Input>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="初始起算日" prop="beginCalculateDate">
                            <DatePicker :editable="false" v-model="assetPool.beginCalculateDate" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                        <FormItem label="发起机构" prop="sponsorId">
                            <Select v-model="assetPool.sponsorId" style="width:200px">
                                <Option v-for="item in sponsorList" :value="item.id" :key="item.id">{{ item.paramDesc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="相关系数乘数" prop="multiplier">
                            <InputNumber :max="1" :min="0" :step="0.1" v-model="assetPool.multiplier" style="width: 200px"></InputNumber>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                        <FormItem label="准备金" prop="reservesMoney">
                            <Input v-model="assetPool.reservesMoney" placeholder="请输入" style="width: 200px"></Input>(万元)
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="待计算文件" prop="file">
                            <Upload style="width: 210px;display: inline-block;"
                                    :before-upload="handleUpload"
                                    action="//test.com/posts/"
                                    :format="['xls','xlsx','xlsm']"
                                    accept=".xls,.xlsx,.xlsm"
                            >
                                <Button type="ghost" icon="ios-cloud-upload-outline" style="width: 200px">选择要上传文件的文件</Button>
                            </Upload>
                            <div style="width: 400px;display: inline-block" v-if="file != null">待上传文件：{{ file.name }}</div>
                        </FormItem>
                        </Col>
                    </Row>
                    <FormItem style="text-align: center;">
                        <Button type="primary" @click="upload('assetPoolForm')" :loading="loadingStatus">提交</Button>
                    </FormItem>
                </Form>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import Util from '../../../libs/util';

    export default {
        name:'portfolioForm',
        data () {
            const validateReservesMoney = (rule, value, callback)=>{
                if(value==''){
                    callback(new Error('准备金不允许为空'));
                }
                if(!Number.isNaN(value)){
                    callback();
                }else {
                    callback(new Error('准备金只允许输入数字'));
                }
            };
            const validateNum = (rule, value, callback)=>{
                if(value==''){
                    callback(new Error('模拟次数不允许为空'));
                }
                let num = Number.parseInt(value);
                if(Number.isInteger(num)){
                    if(num<=0){
                        callback(new Error('请输入大于0的整数'));
                    }else if(num>1000){
                        callback(new Error('目前最大限制输入1000万次'));
                    }else {
                        callback();
                    }
                }else {
                    callback(new Error('模拟次数只允许只允许输入数字'));
                }
            };
            const validateFile = (rule, value, callback)=>{
                if(this.file !=null){
                    callback();
                }else {
                    callback(new Error('请选择文件'));
                }
            };
            const validateSponsor = (rule, value, callback)=>{
                if(value==null||value==''){
                    callback(new Error('发起机构不能为空'));
                }else {
                    callback();
                }
            };
            return {
                assetPool: {
                    reservesMoney: '',
                    beginCalculateDate: null,
                    multiplier:1.0,
                    sponsorId:null,
                    portfolioName:''
                },
                sponsorList:null,
                assetPoolRules:{
                    portfolioName:[
                        {required: true,type:'string', message: '请输入交易名称', trigger: 'blur'}
                    ],
                    reservesMoney:[
                        {required: true,type:'number', validator: validateReservesMoney, trigger: 'blur'}
                    ],
                    multiplier:[
                        {required: true, type:'number',message: '相关系数乘数不允许为空', trigger: 'blur'},
                    ],
                    sponsorId:[
                        {required: true, type: 'string', validator: validateSponsor, trigger: 'change'}
                    ],
                    beginCalculateDate:[
                        {required: true, type: 'date', message: '请选择初始起算日', trigger: 'blur'}
                    ],
                    file:[
                        {required: true, type: 'object', validator: validateFile, trigger: 'change'}
                    ]
                },
                simulationRecordRules:{
                    num:[
                        {required: true, type:'integer',validator: validateNum, trigger: 'blur'},
                    ]
                },
                file: null,
                loadingStatus: false
            };
        },
        methods: {
            handleUpload (file) {
                this.file = file;
                return false;
            },
            upload (name) {
                var _this = this;
                _this.$refs[name].validate((valid)=>{
                    if(valid){
                        _this.loadingStatus = true;
                        let formData = new FormData();
                        Object.keys(_this.assetPool).forEach((key)=>{
                            formData.append(key,_this.assetPool[key]);
                        });
                        formData.append('file',_this.file);
                        formData.append('userId',_this.$store.state.user.id);
                        let config = {
                            headers:{
                                'Content-Type': 'multipart/form-data'
                            }
                        };
                        Util.ajax.post('assetCreditAnalysis/upload',formData,config).then(function (res) {
                            if(res.data){
                                if(res.data.statusCode=='1'){
                                    _this.file=null;
                                    _this.$refs[name].resetFields();
                                    _this.$Message.success('提交成功');
                                    _this.$parent.$parent.closeAddModal();
                                }else {
                                    if(res.data.statusInfo){
                                        _this.$Modal.error({
                                            title: '错误',
                                            content: '提交失败:'+ res.data.statusInfo
                                        });
                                    }else {
                                        _this.$Modal.error({
                                            title: '错误',
                                            content: '提交失败,模板数据有误'
                                        });
                                    }
                                }
                            }
                            _this.loadingStatus = false;
                        }).catch(function (err) {
                            _this.$Modal.error({
                                title: '错误',
                                content: '提交失败'
                            });
                            _this.loadingStatus = false;
                        });
                    }
                });
            },
            getSponsorList(){
                let _this = this;
                Util.ajax.get('/dict/sponsorList').then(function (res) {
                    if(res.data){
                        if(res.data.statusCode=='1'){
                            _this.sponsorList = res.data.data;
                        }
                    }
                }).catch(function (err) {
                    _this.$Message.error('获取发起机构失败');
                });
            }
        },
        mounted () {
            this.getSponsorList();
        }
    };
</script>
