import axios, { AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios';

interface AxiosConfig extends AxiosRequestConfig {
    headers?: AxiosRequestHeaders;
}

export interface Response {
    result: number
    error_msg?: string
    captchaSession?: string
    type?: string
    url?: string
}

// 动态获取 API 基础地址
function getBaseURL(): string {
    // 生产环境或其他环境根据当前域名自动判断
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // 如果是本地访问（localhost 或 127.0.0.1），使用6015端口访问后端
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
            return 'http://localhost:6015';
        }
        
        // 如果是服务器域名访问
        return `${protocol}//${hostname}`;
    }
    
    // 默认情况（SSR 或其他环境）
    return '';
}

const BASE_URL = getBaseURL();

const instance = axios.create({
    timeout: 10 * 1000,
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

const errorHandler = (error: Response) => {
    throw error;
};

const responseHandler = (response: AxiosResponse<Response>) => {
    return new Promise((resolve, reject) => {
        const body = response.data;
        if(body!.result !== 1) {
            reject(body);
        } else {
            resolve(body);
        }
    }).then(null, errorHandler);
};

instance.interceptors.response.use(responseHandler);

export { instance };

export const get = <T>(url: string, params?: object | string, config?: AxiosConfig) => {
    return instance.get<T, Promise<T>>(url, { params, ...config });
};

export const post = <T>(url: string, data?: any, config?: AxiosConfig) => {
    return instance.post<T, Promise<T>>(url, data, config);
};