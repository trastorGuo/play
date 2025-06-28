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
}

#app {
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
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

/* 按钮在移动端的适配 */
@media (max-width: 768px) {
  .el-button {
    font-size: 14px;
    padding: 8px 15px;
  }
  
  .el-button--large {
    font-size: 16px;
    padding: 10px 18px;
  }
}

@media (max-width: 375px) {
  .el-button {
    font-size: 13px;
    padding: 6px 12px;
  }
  
  .el-button--large {
    font-size: 14px;
    padding: 8px 15px;
  }
}

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
