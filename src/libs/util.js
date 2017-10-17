import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title : '联合信用评级数据分析平台';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8082' :
    env === 'production' ?
    'http://172.16.6.3:8082' :
    'http://172.16.6.3:8082';

util.serverUrl = ajaxUrl;

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 600000
});

export default util;