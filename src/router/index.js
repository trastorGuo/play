import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Tool from '@/pages/Tool.vue';
import { setPageMeta, pageMetas } from '@/common/utils/meta.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '主页',
      icon: 'Fire',
      showInNav: true,
      metaKey: 'home'
    }
  },
  {
    path: '/tool',
    name: 'Tool',
    component: Tool,
    meta: {
      title: '工具页面',
      icon: 'LaptopCode',
      showInNav: true,
      metaKey: 'tool'
    }
  },
  {
    path: '/card-game',
    name: 'CardGame',
    component: () => import('@/pages/CardGame.vue'),
    meta: {
      title: '打牌记账',
      icon: 'Star',
      showInNav: true,
      metaKey: 'cardGame'
    }
  },
  {
    path: '/itinerary',
    name: 'Itinerary',
    component: () => import('@/pages/Itinerary.vue'),
    meta: {
      title: '北疆10天逐小时行程',
      icon: 'Calendar',
      showInNav: true,
      metaKey: 'itinerary'
    }
  },
  {
    path: '/room/:roomId?',
    name: 'Room',
    component: () => import('@/pages/Room.vue'),
    meta: {
      title: '房间',
      showInNav: false,
      metaKey: 'room'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫：在每次路由变化时更新页面 meta 信息
router.beforeEach((to, from, next) => {
  // 获取路由的 meta 配置
  const metaKey = to.meta?.metaKey;
  
  if (metaKey && pageMetas[metaKey]) {
    let meta = { ...pageMetas[metaKey] };
    
    // 特殊处理房间页面
    if (metaKey === 'room' && to.params.roomId) {
      meta = {
        ...meta,
        title: `房间 ${to.params.roomId} - 打牌记账`,
        description: `加入房间 ${to.params.roomId}，和朋友一起记录游戏输赢。支持多人在线，操作简单便捷。`,
        keywords: `游戏房间,房间${to.params.roomId},打牌记账,多人游戏,实时同步,trastor`,
        url: `https://www.trastor.com/room/${to.params.roomId}`
      };
    }
    
    // 设置页面 meta 信息
    setTimeout(() => {
      setPageMeta(meta);
    }, 0);
  }
  
  next();
});

export default router;
