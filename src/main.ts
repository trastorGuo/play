/*
 * @Description: 
 * @Date: 2022-08-14 16:22:30
 * @Author: 
 * @LastEditTime: 2022-08-31 23:16:26
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { NoticeBar, Field, Tab, Tabs, Uploader, Toast, Overlay } from 'vant';

import 'vant/es/toast/style';
import 'vant/es/notify/style';
const app = createApp(App);
app.use(router).use(NoticeBar).use(Field).use(Tab).use(Tabs).use(Uploader).use(Toast).use(Overlay);
app.mount('#app');
