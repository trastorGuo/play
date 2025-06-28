import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Tool from '@/pages/Tool.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '主页',
      icon: 'Fire',
      showInNav: true
    }
  },
  {
    path: '/tool',
    name: 'Tool',
    component: Tool,
    meta: {
      title: '工具页面',
      icon: 'LaptopCode',
      showInNav: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
