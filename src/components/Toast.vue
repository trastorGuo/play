<template>
  <div 
    v-if="visible" 
    class="toast-container"
    :class="`toast-${type}`"
  >
    <div class="toast-content">
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast-message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  },
  duration: {
    type: Number,
    default: 3000
  },
  onClose: {
    type: Function,
    default: () => {}
  }
});

const visible = ref(false);
let timer = null;

onMounted(() => {
  visible.value = true;
  
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close();
    }, props.duration);
  }
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});

const close = () => {
  visible.value = false;
  setTimeout(() => {
    props.onClose();
  }, 300);
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  max-width: min(90vw, 400px);
  min-width: 200px;
  z-index: 10000;
  pointer-events: auto;
  animation: slideInDown 0.3s ease-out;
  overflow: hidden;
  box-sizing: border-box;
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  overflow: hidden;
  box-sizing: border-box;
}

.toast-icon {
  margin-right: 8px;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

.toast-success .toast-content {
  background: rgba(76, 175, 80, 0.95);
  color: white;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.toast-error .toast-content {
  background: rgba(244, 67, 54, 0.95);
  color: white;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.toast-warning .toast-content {
  background: rgba(255, 152, 0, 0.95);
  color: white;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

.toast-info .toast-content {
  background: rgba(33, 150, 243, 0.95);
  color: white;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 768px) {
  .toast-container {
    max-width: 90vw;
    min-width: 280px;
  }
  
  .toast-content {
    padding: 10px 14px;
  }
  
  .toast-message {
    font-size: 13px;
  }
}
</style>
