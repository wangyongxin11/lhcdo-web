<style scoped>
    .index {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
        background-image:-webkit-linear-gradient(left top, #9B68EC , #3F9FD9);
    }

    .index h1 {
        height: 150px;
    }

    .index h1 img {
        height: 90px;
    }

    .index h2 {
        color: #666;
        margin-bottom: 200px;
    }

    .index h2 p {
        margin: 0 0 50px;
    }

    .index .ivu-row-flex {
        height: 100%;
    }
    .login-box{
        padding: 50px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 20px rgba(0,0,0,0.3);
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="6" class="login-box">
                <h1>
                    <img src="../../assets/image/logo.png">
                    <p>联合评级数据分析平台</p>
                </h1>
                <Form ref="userForm" :model="user" :rules="ruleForUser">
                    <FormItem prop="username">
                        <Input type="text" v-model="user.username" placeholder="用户名">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="user.password" placeholder="密码">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="info" @click="login('userForm')" size="large" long>登录</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>

    </div>
</template>
<script>
    import Util from '../../libs/util';
    import { setToken } from '../../libs/auth';
    import md5 from 'js-md5';

    export default {
        data () {
            return {
                user: {
                    username: '',
                    password: ''
                },
                ruleForUser: {
                    username: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            login(name) {
                var _this = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let newUser = {};
                        newUser.username = _this.user.username;
                        newUser.password = md5(_this.user.password);
                        Util.ajax.post('user/login',newUser).then(function(res){
                            if(res.data){
                                if('1' == res.data.statusCode){
                                    let u = res.data.data;
                                    setToken(u.accessToken);
                                    _this.$store.commit('changeUser',{user:u});
                                    let redirectPath = _this.$router.currentRoute.query.redirect;
                                    if(redirectPath&&redirectPath!=='/'){
                                        _this.$router.push({path:redirectPath});
                                    }else {
                                        _this.$router.push({name:'home_index'});
                                    }
                                }else {
                                    let content = '';
                                    if(res.data.statusInfo){
                                        content = res.data.statusInfo;
                                    }else {
                                        content = '登录失败';
                                    }
                                    _this.$Modal.error({
                                        title: '错误',
                                        content:content
                                    });
                                }
                            }
                        }).catch(function (err) {
                            console.log(err);
                            _this.$Modal.error({
                                title: '错误',
                                content: '登录失败'
                            });
                        });
                    }
                });
            }
        }
    };
</script>