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

// TODO 考虑正式环境地址
// 开发环境使用代理，不需要指定完整的URL
const BASE_URL = process.env.NODE_ENV === 'production' ? "http://localhost:6015" : "";

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