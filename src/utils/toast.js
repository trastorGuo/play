import { createApp } from 'vue';
import Toast from '@/components/Toast.vue';

// Toast容器管理
class ToastManager {
  constructor() {
    this.toasts = new Map();
    this.zIndex = 10000;
  }

  show(message, type = 'info', duration = 3000) {
    const id = Date.now() + Math.random();
    
    // 创建Toast实例
    const app = createApp(Toast, {
      message,
      type,
      duration,
      onClose: () => {
        this.remove(id);
      }
    });

    // 创建容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = `${20 + this.toasts.size * 60}px`;
    container.style.left = '0';
    container.style.right = '0';
    container.style.zIndex = this.zIndex++;
    container.style.pointerEvents = 'none';
    
    // 挂载到body
    document.body.appendChild(container);
    const instance = app.mount(container);
    
    // 存储实例
    this.toasts.set(id, {
      app,
      container,
      instance
    });

    // 重新排列Toast位置
    this.updatePositions();
    
    return id;
  }

  remove(id) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.app.unmount();
      if (toast.container.parentNode) {
        toast.container.parentNode.removeChild(toast.container);
      }
      this.toasts.delete(id);
      this.updatePositions();
    }
  }

  updatePositions() {
    let index = 0;
    this.toasts.forEach((toast) => {
      if (toast.container) {
        toast.container.style.top = `${20 + index * 60}px`;
        index++;
      }
    });
  }

  clear() {
    this.toasts.forEach((toast, id) => {
      this.remove(id);
    });
  }
}

// 创建全局实例
const toastManager = new ToastManager();

// 导出方法
const ToastAPI = {
  success(message, duration = 3000) {
    return toastManager.show(message, 'success', duration);
  },
  
  error(message, duration = 4000) {
    return toastManager.show(message, 'error', duration);
  },
  
  warning(message, duration = 3500) {
    return toastManager.show(message, 'warning', duration);
  },
  
  info(message, duration = 3000) {
    return toastManager.show(message, 'info', duration);
  },

  show(message, type = 'info', duration = 3000) {
    return toastManager.show(message, type, duration);
  },

  remove(id) {
    return toastManager.remove(id);
  },

  clear() {
    return toastManager.clear();
  }
};

// 默认导出
export default ToastAPI;
