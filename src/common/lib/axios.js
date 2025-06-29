var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import axios from 'axios';
// 动态获取 API 基础地址
function getBaseURL() {
    // 开发环境使用代理，不需要指定完整的URL
    if (process.env.NODE_ENV === 'development') {
        return '';
    }
    // 生产环境根据当前域名自动判断
    if (typeof window !== 'undefined') {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;
        // 如果是本地访问（localhost 或 127.0.0.1）
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
            return 'http://localhost:6015';
        }
        // 如果是服务器域名访问
        return protocol + '//' + hostname;
    }
    // 默认情况（SSR 或其他环境）
    return '';
}
var BASE_URL = getBaseURL();
var instance = axios.create({
    timeout: 10 * 1000,
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});
var errorHandler = function (error) {
    throw error;
};
var responseHandler = function (response) {
    return new Promise(function (resolve, reject) {
        var body = response.data;
        if (body.result !== 1) {
            reject(body);
        }
        else {
            resolve(body);
        }
    }).then(null, errorHandler);
};
instance.interceptors.response.use(responseHandler);
export { instance };
export var get = function (url, params, config) {
    return instance.get(url, __assign({ params: params }, config));
};
export var post = function (url, data, config) {
    return instance.post(url, data, config);
};
// # sourceMappingURL=axios.js.map