<template>
  <div v-if="navLinks.length > 0" class="links">
    <div class="line">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title text-white">我的页面</span>
    </div>
    <!-- 网站列表 -->
    <Swiper
      v-if="navLinks.length > 0"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="true"
    >
      <SwiperSlide v-for="linkGroup in siteLinksList" :key="linkGroup">
        <el-row class="link-all" :gutter="20">
          <el-col v-for="(item, index) in linkGroup" :span="8" :key="item.path">
            <div
              class="item cards"
              :style="index < 3 ? 'margin-bottom: 20px' : null"
              @click="jumpToRoute(item.path)"
            >
              <Icon size="26">
                <component :is="siteIcon[item.meta.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.meta.title }}</span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
// 可前往 https://www.xicons.org 自行挑选并在此处引入
import { Link, Blog, CompactDisc, Cloud, Book, Fire, LaptopCode, Camera, Calendar, Heart, Star, Code } from "@vicons/fa";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper/modules";
import { useRouter } from 'vue-router';

const router = useRouter();

// 从路由配置中获取需要在导航中显示的页面
const navLinks = computed(() => {
  return router.getRoutes().filter(route => route.meta?.showInNav === true);
});

// 计算网站链接分组（每组6个）
const siteLinksList = computed(() => {
  const result = [];
  const links = navLinks.value;
  for(let i = 0; i < links.length; i += 6) {
    const subArr = links.slice(i, i + 6);
    result.push(subArr);
  }
  return result;
});

// 网站链接图标
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Book,
  Fire,
  LaptopCode,
  Camera,
  
  Calendar,
  Heart,
  Star,
  Code
};

// 路由跳转
const jumpToRoute = (path) => {
  router.push(path);
};

onMounted(() => {
  console.log('导航链接:', navLinks.value);
});
</script>

<style lang="scss" scoped>
.links {
  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s;
    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
    }
  }
  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;
    .swiper-slide {
      height: 100%;
    }
    .swiper-pagination {
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 20px;
        height: 4px;
        margin: 0 4px;
        border-radius: 4px;
        opacity: 0.2;
        transition: opacity 0.3s;
        &.swiper-pagination-bullet-active {
          opacity: 1;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .link-all {
    height: 220px;
    .item {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;

      &:hover {
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      &:active {
        transform: scale(1);
      }

      .name {
        font-size: 1.1rem;
        margin-left: 8px;
      }
      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }
      @media (max-width: 720px) {
        height: 80px;
      }
      @media (max-width: 460px) {
        flex-direction: column;
        .name {
          font-size: 1rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }
    @media (max-width: 720px) {
      height: 180px;
    }
    
    // 特别小的屏幕竖排展示
    @media (max-width: 360px) {
      height: auto;
      min-height: 400px;
      
      .el-row {
        flex-direction: column;
        width: 100%;
        gap: 0;
      }
      
      .el-col {
        width: 100% !important;
        max-width: 100% !important;
        flex: none !important;
        margin-bottom: 10px;
        
        &:nth-child(1), &:nth-child(2), &:nth-child(3) {
          margin-bottom: 10px !important;
        }
      }
      
      .item {
        height: 60px;
        width: 90%;
        margin: 0 auto 0 auto;
        flex-direction: row;
        justify-content: flex-start;
        padding: 0 15px;
        
        .name {
          font-size: 0.9rem;
          margin-left: 10px;
          margin-top: 0;
        }
      }
    }
  }
}
</style>
