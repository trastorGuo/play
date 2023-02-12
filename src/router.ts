/*
 * @Description: 
 * @Date: 2022-08-23 21:55:35
 * @Author: 
 * @LastEditTime: 2022-08-24 00:00:56
 */

import { createWebHistory, createRouter } from 'vue-router';
import Account from './pages/Account.vue';
import OpenRoom from './components/account/OpenRoom.vue';



import Main from './pages/Main.vue';
import Tool from './pages/Tool.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: "/",
        name: "main",
        meta: { title: 'trastor' },
        component: Main
    },
    {
        path: "/account",
        name: "account",
        meta: { title: '整起来' },
        children: [{
            path: 'openroom',
            component: OpenRoom
        }],
        component: Account
    },
    {
        path: "/tool",
        name: "tool",
        meta: { title: 'tool' },
        component: Tool
    }]
});

router.beforeEach((to) => {
    document.title = to.meta.title as string;
    window.scrollTo(0, 0);
});

export default router;