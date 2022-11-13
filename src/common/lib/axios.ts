/*
 * @Description: 
 * @Date: 2022-09-04 22:33:14
 * @Author: 
 * @LastEditTime: 2022-09-04 22:37:30
 */
import axios from "axios";


export function get(url: string) {
    return axios.get(url);
}

export function post(url: string, params: object) {
    return axios.post(url, { params });
}