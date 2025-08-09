<template>
  <router-view />
</template>

<script setup>
// 路由页面容器
</script>

<style lang="scss">
/* 全局样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-x: hidden;
}

/* 确保页面可以滚动 */
html, body {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

#app {
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  position: relative;
}

/* 移动端设置2000px宽度，支持滑动查看 */
@media (max-width: 768px) {
  html, body {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
  }
  
  #app {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    min-height: 100vh;
  }
}

/* Element Plus 组件移动端适配 */
.el-tabs__content {
  overflow-x: hidden;
}

.el-upload {
  width: 100%;
}

.el-upload-dragger {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box;
}

/* 移除按钮移动端适配，保持PC端样式 */

/* 路由过渡动画 */
.router-link-active {
  color: #409eff;
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
