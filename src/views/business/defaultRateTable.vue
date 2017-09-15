<style scoped>
    .tableShowArea {
        border: 1px solid #e3e8ee;
        padding: 20px 15px;
        margin-bottom: 20px
    }

</style>
<template>
    <div style="margin: 20px 15px">
        <div style="border: 1px solid #e3e8ee;padding: 20px 15px;margin-bottom: 20px">
            <Row :gutter="16">
                <Col span="16">
                    <Card dis-hover style="height: 250px;">
                        <Form ref="assetPoolForm" :model="assetPool" :rules="assetPoolRules" :label-width="100">
                            <Row>
                                <Col span="10">
                                    <FormItem label="准备金" prop="reservesMoney">
                                        <Input v-model="assetPool.reservesMoney" placeholder="请输入" style="width: 200px"></Input>(万元)
                                    </FormItem>
                                </Col>
                                <Col span="14">
                                    <FormItem label="模拟次数" prop="num">
                                        <Input v-model="assetPool.num" placeholder="请输入" style="width: 200px"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="10">
                                    <FormItem label="初始起算日" prop="beginCalculateDate">
                                        <DatePicker :editable="false" v-model="assetPool.beginCalculateDate" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="14">
                                    <FormItem label="待计算文件" prop="file">
                                        <Upload
                                                :before-upload="handleUpload"
                                                action="//test.com/posts/"
                                                :format="['xls','xlsx','xlsm']"
                                                accept=".xls,.xlsx,.xlsm"
                                        >
                                            <Button type="ghost" icon="ios-cloud-upload-outline">选择要上传文件的文件</Button>
                                        </Upload>
                                        <div v-if="file !== null">待上传文件：{{ file.name }}</div>
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem style="text-align: center;">
                                <Button type="primary" @click="upload('assetPoolForm')" :loading="loadingStatus">提交</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </Col>
                <Col span="8">
                    <Card dis-hover style="text-align: center;height: 250px;">
                        <!--<div v-if="isBeginSimulate">
                            <i-circle
                                    :size="180"
                                    :trail-width="4"
                                    :stroke-width="5"
                                    :percent="75"
                                    stroke-linecap="square"
                                    stroke-color="#43a3fb">
                                <div class="demo-i-circle-custom">
                                    <p>已模拟次数</p>
                                    <h1>23421</h1>
                                </div>
                            </i-circle>
                        </div>-->
                        <!--<div v-else>-->
                            <Button :disabled="simulateButtonDisable" type="primary" size="large" :loading="simulating" @click="beginSimulate">
                                <span v-if="simulating">
                                    正在模拟...
                                </span>
                                <span v-else>
                                    开始模拟
                                </span>
                            </Button>
                        <!--</div>-->
                    </Card>
                </Col>
            </Row>
        </div>
        <div class="tableShowArea" v-if="analysisResult != null">
            <a :href="downloadLink">{{analysisResult.fileName}}<Button type="text" >下载模拟结果</Button></a>
            <!--<div style="display: none">
                <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
                    <Checkbox label="show">展示</Checkbox>
                    <Checkbox label="weak">唤醒</Checkbox>
                    <Checkbox label="signin">登录</Checkbox>
                    <Checkbox label="click">点击</Checkbox>
                    <Checkbox label="active">激活</Checkbox>
                    <Checkbox label="day7">7日留存</Checkbox>
                    <Checkbox label="day30">30日留存</Checkbox>
                    <Checkbox label="tomorrow">次日留存</Checkbox>
                    <Checkbox label="day">日活跃</Checkbox>
                    <Checkbox label="week">周活跃</Checkbox>
                    <Checkbox label="month">月活跃</Checkbox>
                </Checkbox-group>
                <Table :data="tableData2" :columns="tableColumns2" border ></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="100" :current="1" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>-->
        </div>
    </div>
</template>
<script>
    import Util from '../../libs/util';

    export default {
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
            return {
                assetPool: {
                    reservesMoney: '',
                    num: '',
                    beginCalculateDate: null,
                    summaryType:2
                },
                assetPoolRules:{
                    reservesMoney:[
                        {required: true,type:'number', validator: validateReservesMoney, trigger: 'blur'}
                    ],
                    num:[
                        {required: true, type:'integer',validator: validateNum, trigger: 'blur'},
                    ],
                    beginCalculateDate:[
                        {required: true, type: 'date', message: '请选择初始起算日', trigger: 'blur'}
                    ],
                    file:[
                        {required: true, type: 'object', validator: validateFile, trigger: 'change'}
                    ]
                },
                file: null,
                loadingStatus: false,
                tableData2: this.mockTableData2(),
                tableColumns2: [],
                tableColumnsChecked: ['show', 'weak', 'signin', 'click', 'active', 'day7', 'day30', 'tomorrow', 'day', 'week', 'month'],
                isBeginSimulate:false,
                uploadRecordId:null,
                simulating:false,
                simulateButtonDisable:true,
                analysisResult:null,
                downloadLink:''
            };
        },
        methods: {
            mockTableData2 () {
                let data = [];
                function getNum() {
                    return Math.floor(Math.random () * 10000 + 1);
                }
                for (let i = 0; i < 10; i++) {
                    data.push({
                        name: '推广名称' + (i+1),
                        fav: 0,
                        show: getNum(),
                        weak: getNum(),
                        signin: getNum(),
                        click: getNum(),
                        active: getNum(),
                        day7: getNum(),
                        day30: getNum(),
                        tomorrow: getNum(),
                        day: getNum(),
                        week: getNum(),
                        month: getNum()
                    });
                }
                return data;
            },
            getTable2Columns () {
                const table2ColumnList = {
                    name: {
                        title: '名称',
                        key: 'name',
                        fixed: 'left',
                        width: 150,
                        render: (h, params) => {
                            const fav = this.tableData2[params.index].fav;
                            const style = fav === 0 ? {
                                cursor: 'pointer'
                            } : {
                                cursor: 'pointer',
                                color: '#f50'
                            };

                            return h('div', [
                                h('Icon', {
                                    style: style,
                                    props: {
                                        type: fav === 0 ? 'ios-star-outline' : 'ios-star'
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.toggleFav(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    show: {
                        title: '展示',
                        key: 'show',
                        width: 150,
                        sortable: true
                    },
                    weak: {
                        title: '唤醒',
                        key: 'weak',
                        width: 150,
                        sortable: true
                    },
                    signin: {
                        title: '登录',
                        key: 'signin',
                        width: 150,
                        sortable: true
                    },
                    click: {
                        title: '点击',
                        key: 'click',
                        width: 150,
                        sortable: true
                    },
                    active: {
                        title: '激活',
                        key: 'active',
                        width: 150,
                        sortable: true
                    },
                    day7: {
                        title: '7日留存',
                        key: 'day7',
                        width: 150,
                        sortable: true
                    },
                    day30: {
                        title: '30日留存',
                        key: 'day30',
                        width: 150,
                        sortable: true
                    },
                    tomorrow: {
                        title: '次日留存',
                        key: 'tomorrow',
                        width: 150,
                        sortable: true
                    },
                    day: {
                        title: '日活跃',
                        key: 'day',
                        width: 150,
                        sortable: true
                    },
                    week: {
                        title: '周活跃',
                        key: 'week',
                        width: 150,
                        sortable: true
                    },
                    month: {
                        title: '月活跃',
                        key: 'month',
                        width: 150,
                        sortable: true
                    },
                    operation:{
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                };

                let data = [table2ColumnList.name];

                this.tableColumnsChecked.forEach(col => data.push(table2ColumnList[col]));

                data.push(table2ColumnList.operation);

                return data;
            },
            changeTableColumns () {
                this.tableColumns2 = this.getTable2Columns();
            },
            toggleFav (index) {
                this.tableData2[index].fav = this.tableData2[index].fav === 0 ? 1 : 0;
            },
            changePage () {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.tableData1 = this.mockTableData2();
            },
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
                        let config = {
                            headers:{
                                'Content-Type': 'multipart/form-data'
                            }
                        };
                        Util.ajax.post('assetCreditAnalysis/upload',formData,config).then(function (res) {
                            if(res.data){
                                if(res.data.statusCode=='1'){
                                    _this.uploadRecordId = res.data.data;
                                    _this.file=null;
                                    _this.$refs[name].resetFields();
                                    _this.$Message.success('提交成功');
                                    _this.simulateButtonDisable = false;
                                }else {
                                    _this.$Message.error(res.data.statusInfo);
                                }
                            }
                            _this.loadingStatus = false;
                        }).catch(function (error) {
                            if (error.response) {
                                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                            console.log(error.config);
                            _this.loadingStatus = false;
                        });
                    }
                });
            },
            beginSimulate () {
                var _this = this;
                this.simulating = true;
                this.simulateButtonDisable = true;
                if(_this.uploadRecordId!=null){
                    let serverUrl = Util.serverUrl;
                    Util.ajax.get('assetCreditAnalysis/analysis/'+this.uploadRecordId).then(function(res){
                        if(res.data){
                            _this.simulating = false;
                            _this.simulateButtonDisable = false;
                            _this.analysisResult = res.data;
                            _this.downloadLink = serverUrl+"/assetCreditAnalysis/download/"+_this.uploadRecordId;
                        }
                    }).catch(function (error) {
                        if (error.response) {
                            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                        _this.loadingStatus = false;
                    });
                    this.isBeginSimulate = true;
                }
            }
        },
        mounted () {
            this.changeTableColumns();
        }
    };
</script>
