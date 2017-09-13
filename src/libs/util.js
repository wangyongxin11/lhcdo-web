import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title : '联合信用评级模型分析系统';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8081' :
    env === 'production' ?
    'https://www.url.com' :
    'https://debug.url.com';

util.serverUrl = ajaxUrl;

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 600000
});

export default util;