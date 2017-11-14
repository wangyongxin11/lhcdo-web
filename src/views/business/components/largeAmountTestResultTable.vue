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
</style>
<template>
    <div class="layout">
        <Row type="flex">
            <Col span="24">
                <div class="layout-content">
                    <Table stripe border :height="400" :columns="titleList" :data="results"></Table>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import Util from '@/libs/util.js';

    export default {
        name:'largeAmountTable',
        props: {
            results: Array
        },
        data () {
            return {
                titleList: [
                    {
                        type:'index',
                        align:'center',
                        title: '编号',
                    },
                    {
                        title: 'Target Rating',
                        key: 'targetCreditLevel',
                        align:'center'
                    },
                    {
                        title: 'Minmum Support',
                        key: 'minimumSupport',
                        align:'center',
                        render:(h,params)=>{
                            let val = params.row.minimumSupport * 100;
                            if(val>0){
                                val = val.toFixed(3);
                            }
                            return h('span',val+'%');
                        }
                    },
                    /*{
                        title: '操作',
                        key: 'action',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: Util.serverUrl+'/largeAmountTest/result/'+params.row.resultId,
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
                    }*/
                ]
            };
        },
        methods: {

        }
    };
</script>