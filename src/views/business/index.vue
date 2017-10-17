<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
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
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-ceiling{
        background: #fff;
        padding: 10px 0;
        overflow: hidden;
        box-shadow: 0 2px 5px #ccc;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
    }
    .layout-ceiling-main button{
        margin-left: 10px;
    }
    .layout-logo{
        height: 30px;
        position: relative;
        left: 20px;
        line-height: 30px;
        color: #3b94ef;
        font-size: 18px;
        font-weight: 600;
        float: left;
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
        top: 12px;
        right: 144px;
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
            <div class="layout-ceiling">
                <div class="layout-logo">联合评级数据分析平台</div>
                <div class="layout-ceiling-main">
                    <span><Icon type="ios-person-outline" class="role-icon"></Icon>Admin</span>
                    <Button type="primary">退出登录</Button>
                </div>
            </div>
            </Col>
            <Col span="5" class="layout-menu-left">
            <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">

                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        基础
                    </template>
                    <MenuItem name="1-1">行业分类</MenuItem>
                    <MenuItem name="1-2">理想违约率</MenuItem>
                    <MenuItem name="1-3">资产相关性</MenuItem>
                    <MenuItem name="1-4">级别映射</MenuItem>
                    <MenuItem name="1-5">行业违约回收率</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-keypad"></Icon>
                        计算
                    </template>
                    <MenuItem name="2-1">资产池列表</MenuItem>
                    <MenuItem name="2-2">模型计算</MenuItem>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-analytics"></Icon>
                        应用
                    </template>
                    <MenuItem name="3-1">选项 1</MenuItem>
                    <MenuItem name="3-2">选项 2</MenuItem>
                </Submenu>
            </Menu>
            </Col>
            <Col span="19">
            <div class="layout-breadcrumb">
                <Breadcrumb>
                    <BreadcrumbItem href="#">首页</BreadcrumbItem>
                    <BreadcrumbItem href="#">应用中心</BreadcrumbItem>
                    <BreadcrumbItem>某应用</BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div class="layout-content">
                <Row class="action-area">
                    <Col span="4">
                    <Input v-model="value" placeholder="请输入项目名称..." icon="ios-search"></Input>
                    </Col>
                    <Col span="4">
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
                    </Col>
                    <Col span="16">
                    <div class="button-group">
                        <Button type="primary">只看自己</Button>
                        <Button type="primary">显示其他字段</Button>
                        <Button type="primary"><Icon type="android-add"></Icon> 新建资产池</Button>
                    </div>
                    </Col>
                </Row>

                <Table stripe :columns="columns1" :data="data1"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="100" :current="1" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>
            </Col>
        </Row>
        <div class="layout-copy">
            2011-2016 &copy; TalkingData
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns1: [
                    {
                        type: 'index',
                        title: '编号'
                    },
                    {
                        title: '项目名称',
                        key: 'project'
                    },
                    {
                        title: '交易名称',
                        key: 'business'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 1 ? 'red' : 'green';
                            const text = row.status === 1 ? '失败' : '成功';
                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '创建人',
                        key: 'founder'
                    },
                    {
                        title: '创建日期',
                        key: 'date',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '计算'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data1: [
                    {
                        project: '项目1',
                        business: '2014年第一期',
                        status: '北京市朝阳区芍药居',
                        founder:'admin',
                        date:'2017-08-28 13:23:24'
                    },
                    {
                        project: '项目2',
                        business: '2014年第一期',
                        status: '北京市朝阳区芍药居',
                        founder:'admin',
                        date:'2017-08-23 13:23:24'
                    },
                    {
                        project: '项目3',
                        business: '2014年第一期',
                        status: '北京市朝阳区芍药居',
                        founder:'admin',
                        date:'2017-08-27 13:23:24'
                    },
                    {
                        project: '项目4',
                        business: '2014年第一期',
                        status: '北京市朝阳区芍药居',
                        founder:'admin',
                        date:'2017-08-24 13:23:24'
                    }
                ],
                value:''
            };
        },
        methods: {
            show (index) {
                this.$Modal.info({
                    title: '项目信息',
                    content: `项目名称：${this.data1[index].project}<br>交易名称：${this.data1[index].business}<br>创建人：${this.data1[index].founder}`
                });
            },
            remove (index) {
                this.data1.splice(index, 1);
            },
            changePage () {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.data1 = this.mockTableData1();
            }
        }
    };
</script>