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
  },
  {
    path: '/card-game',
    name: 'CardGame',
    component: () => import('@/pages/CardGame.vue'),
    meta: {
      title: '打牌记账',
      icon: 'Star',
      showInNav: true
    }
  },
  {
    path: '/room/:roomId?',
    name: 'Room',
    component: () => import('@/pages/Room.vue'),
    meta: {
      title: '房间',
      showInNav: false
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
