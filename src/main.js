import { createApp } from "vue";
import "@/style/style.scss";
import App from "@/App.vue";
import router from "@/router";
// 引入 pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// 引入 ElementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// swiper
import "swiper/css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.mount("#app");

// PWA
navigator.serviceWorker.addEventListener("controllerchange", () => {
  // 弹出更新提醒
  
});
