<template>
  <!-- 基本信息 -->
  <div class="message">
    <!-- Logo -->
    <div class="logo">
      <div :class="{ name: true, 'text-hidden': true, long: siteUrl[0].length >= 6 }">
        <span class="bg">{{ siteUrl[0] }}</span>
        <span class="sm">.{{ siteUrl[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// 站点链接
const siteUrl = computed(() => {
  const url = process.env.VUE_APP_SITE_URL;
  if(!url) return "trastor.com".split(".");
  // 判断协议前缀
  if(url.startsWith("http://") || url.startsWith("https://")) {
    const urlFormat = url.replace(/^(https?:\/\/)/, "");
    return urlFormat.split(".");
  }
  return url.split(".");
});
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  
  // 手机端铺满屏幕，完全禁止滚动条
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    box-sizing: border-box;
  }
  
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    animation: fade 0.5s;
    max-width: 460px;
    
    .name {
      width: 100%;
      font-family: "Pacifico-Regular";
      white-space: nowrap;

      .bg {
        font-size: 5rem;
      }

      .sm {
        margin-left: 6px;
        font-size: 2rem;
        @media (min-width: 721px) and (max-width: 789px) {
          display: none;
        }
      }
    }
    @media (max-width: 768px) {
      .name {
        .bg {
          font-size: 4.5rem;
        }
        .sm {
          font-size: 2rem;
        }
      }
    }

    @media (max-width: 720px) {
      max-width: 100%;
      .name {
        .bg {
          font-size: 4rem;
        }
        .sm {
          font-size: 1.8rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .name {
        .bg {
          font-size: 3.5rem;
        }
        .sm {
          font-size: 1.5rem;
        }
      }
    }
    
    @media (max-width: 360px) {
      .name {
        .bg {
          font-size: 3rem;
        }
        .sm {
          font-size: 1.3rem;
        }
      }
    }
    
    // 非常小的屏幕才允许换行和滚动
    @media (max-width: 280px) {
      .name {
        white-space: normal;
        .bg {
          font-size: 2.5rem;
        }
        .sm {
          font-size: 1.1rem;
        }
      }
    }
  }
}
</style>
