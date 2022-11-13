/*
 * @Description: 
 * @Date: 2022-08-23 21:55:35
 * @Author: 
 * @LastEditTime: 2022-08-24 00:00:56
 */

import { createWebHistory, createRouter } from 'vue-router';
import Account from './pages/Account.vue';
import Tool from './pages/Tool.vue';

export default createRouter({
    history: createWebHistory(),
    routes: [{
        path: "/",
        name: "Account",
        component: Account
    },
    {
        path: "/account",
        name: "Account",
        component: Account
    },
    {
        path: "/tool",
        name: "Tool",
        component: Tool
    }]
});