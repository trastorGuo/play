<template>
  <div class="page-navigation">
    <div class="nav-content">
      <!-- 左侧返回按钮 -->
      <div class="nav-left">
        <button class="back-btn" @click="goBack">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-text">返回</span>
        </button>
      </div>
      
      <!-- 中间标题区域 -->
      <div class="nav-center">
        <h1 class="nav-title">{{ title }}</h1>
        <p v-if="subtitle" class="nav-subtitle">{{ subtitle }}</p>
      </div>
      
      <!-- 右侧操作区域 -->
      <div class="nav-right">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  backPath: {
    type: String,
    default: '/'
  },
  forceBackPath: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

const goBack = () => {
  if(props.forceBackPath) {
    router.push(props.backPath);
  } else if(window.history.length > 1) {
    router.go(-1);
  } else {
    router.push(props.backPath);
  }
};
</script>

<style lang="scss" scoped>
.page-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .nav-left {
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }
  
  .nav-center {
    flex: 2;
    text-align: center;
    color: #fff;
  }
  
  .nav-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  
  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
    
    .back-icon {
      width: 16px;
      height: 16px;
    }
  }
  
  .nav-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .nav-subtitle {
    font-size: 0.9rem;
    opacity: 0.8;
    margin: 0.2rem 0 0 0;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-navigation {
    .nav-content {
      padding: 0.8rem 1rem;
    }
    
    .nav-title {
      font-size: 1.2rem;
    }
    
    .nav-subtitle {
      font-size: 0.8rem;
    }
    
    .back-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      
      .back-icon {
        width: 14px;
        height: 14px;
      }
    }
  }
}

@media (max-width: 480px) {
  .page-navigation {
    .nav-content {
      padding: 0.6rem 0.8rem;
    }
    
    .nav-title {
      font-size: 1.1rem;
    }
    
    .nav-subtitle {
      font-size: 0.75rem;
    }
    
    .back-btn {
      .back-text {
        display: none;
      }
    }
  }
}
</style>
