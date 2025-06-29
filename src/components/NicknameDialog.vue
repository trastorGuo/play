<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="85%"
    :max-width="320"
    center
    :close-on-click-modal="false"
    :show-close="false"
    class="custom-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">{{ title }}</span>
        <button v-if="showClose" class="dialog-close-btn" @click="debounceClick(handleClose, 'closeDialog')">
          <svg class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </template>
    
    <div class="nickname-dialog-content">
      <div class="avatar-preview">
        <UserAvatar :nickname="nickname" :size="60" />
        <p class="avatar-tip">根据昵称自动生成头像</p>
      </div>
      
      <el-input
        v-model="nickname"
        :placeholder="placeholder"
        size="large"
        maxlength="10"
        show-word-limit
        clearable
      />
      
      <div class="dialog-tips">
        <p v-for="tip in tips" :key="tip">• {{ tip }}</p>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button 
          type="primary" 
          @click="debounceClick(handleConfirm, 'confirmNickname', 800)" 
          size="large"
          :loading="loading"
          :disabled="!isValidNickname"
          class="confirm-btn"
        >
          {{ loading ? loadingText : confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ElDialog, ElInput, ElButton } from 'element-plus';
import UserAvatar from './UserAvatar.vue';
import { validateNickname } from '@/utils/userUtils';
import { debounceClick } from '@/utils/debounce.js';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '设置昵称'
  },
  placeholder: {
    type: String,
    default: '请输入你的昵称'
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  loadingText: {
    type: String,
    default: '处理中...'
  },
  tips: {
    type: Array,
    default: () => ['昵称不能为空', '昵称不能与房间内其他人重复']
  },
  loading: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  initialValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'close']);

const nickname = ref('');

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isValidNickname = computed(() => {
  const validation = validateNickname(nickname.value);
  return validation.valid;
});

const handleConfirm = () => {
  if (isValidNickname.value) {
    emit('confirm', nickname.value.trim());
  }
};

const handleClose = () => {
  emit('close');
  visible.value = false;
};

watch(visible, (newValue) => {
  if (newValue) {
    nickname.value = props.initialValue;
  }
});
</script>

<style scoped>
.nickname-dialog-content .avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 12px;
}

.nickname-dialog-content .avatar-preview .avatar-tip {
  font-size: 12px;
  color: #6c757d;
  margin: 0;
  opacity: 0.6;
  font-weight: 500;
  margin-top: 4px;
}

.nickname-dialog-content .el-input {
  margin: 12px 0;
}

.nickname-dialog-content :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.nickname-dialog-content :deep(.el-input__wrapper:hover) {
  border-color: #ced4da;
}

.nickname-dialog-content :deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 3px 8px rgba(64,158,255,0.12);
}

.nickname-dialog-content .dialog-tips {
  margin-top: 12px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border-left: 3px solid #409eff;
}

.nickname-dialog-content .dialog-tips p {
  font-size: 13px;
  color: #495057;
  margin: 3px 0;
  line-height: 1.4;
}

.nickname-dialog-content .dialog-tips p:first-child {
  margin-top: 0;
}

.nickname-dialog-content .dialog-tips p:last-child {
  margin-bottom: 0;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 12px 20px;
  background: #fff;
}

.dialog-header .dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  flex: 1;
  letter-spacing: 0.3px;
}

.dialog-header .dialog-close-btn {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dialog-header .dialog-close-btn:hover {
  background: #e9ecef;
  transform: translateY(-50%) scale(1.05);
}

.dialog-header .dialog-close-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.dialog-header .dialog-close-btn .close-icon {
  width: 18px;
  height: 18px;
  color: #1a1a1a !important;
  stroke: #1a1a1a !important;
  fill: #1a1a1a !important;
  stroke-width: 3;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.dialog-footer .el-button {
  min-width: 120px;
}

.dialog-footer .confirm-btn {
  flex: 1;
  max-width: 200px;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 3px 8px rgba(64,158,255,0.25);
  transition: all 0.3s ease;
}

.dialog-footer .confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64,158,255,0.35);
}

.dialog-footer .confirm-btn:active {
  transform: translateY(0);
}

:deep(.custom-dialog .el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}

:deep(.custom-dialog .el-dialog__header) {
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.custom-dialog .el-dialog__body) {
  padding: 16px 20px;
}

:deep(.custom-dialog .el-dialog__footer) {
  padding: 12px 20px 16px;
  border-top: 1px solid #eee;
}
</style>
