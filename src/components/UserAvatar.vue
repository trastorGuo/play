<template>
  <div class="user-avatar" :style="{ width: size + 'px', height: size + 'px' }">
    <div v-if="avatarSvg" v-html="avatarSvg" class="avatar-svg"></div>
    <div v-else class="avatar-fallback">
      {{ nickname ? nickname.charAt(0).toUpperCase() : '?' }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import multiavatar from '@multiavatar/multiavatar';

const props = defineProps({
  nickname: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 40
  }
});

const avatarSvg = ref('');

// 根据昵称生成SVG
const generateSvg = () => {
  try {
    let seed = props.nickname || 'default';
    
    // 生成SVG
    const svg = multiavatar(seed);
    avatarSvg.value = svg;
  } catch(error) {
    console.error('生成头像SVG失败:', error);
    avatarSvg.value = '';
  }
};

// 监听昵称变化
watch(() => props.nickname, generateSvg, { immediate: true });

onMounted(generateSvg);
</script>

<style scoped>
.user-avatar {
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.avatar-svg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-svg :deep(svg) {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 60%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
