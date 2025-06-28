<template>
  <div
    class="hitokoto cards"
    v-show="!store.musicOpenState"
    @mouseenter="openMusicShow = true"
    @mouseleave="openMusicShow = false"
    @click.stop
  >
    <!-- 打开音乐面板 -->
    <Transition name="el-fade-in-linear">
      <div
        class="open-music"
        v-show="openMusicShow && store.musicIsOk"
        @click="store.musicOpenState = true"
      >
        <music-menu theme="filled" size="18" fill="#efefef" />
        <span>打开音乐播放器</span>
      </div>
    </Transition>
    <!-- 一言内容 -->
    <Transition name="el-fade-in-linear" mode="out-in">
      <div :key="hitokotoData.text" class="content" @click="updateHitokoto">
        <span class="text">{{ hitokotoData.text }}</span>
        <span class="from">-「&nbsp;{{ hitokotoData.from }}&nbsp;」</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { MusicMenu, Error } from "@icon-park/vue-next";
import { getHitokoto } from "@/api";
import { mainStore } from "@/store";
import debounce from "@/utils/debounce.js";

const store = mainStore();

// 开启音乐面板按钮显隐
const openMusicShow = ref(false);

// 一言数据
const hitokotoData = reactive({
  text: "这里应该显示一句话",
  from: "無名"
});

// 获取一言数据
const getHitokotoData = async () => {
  try {
    const result = await getHitokoto();
    hitokotoData.text = result.hitokoto;
    hitokotoData.from = result.from;
  } catch(error) {
    ElMessage({
      message: "一言获取失败",
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef"
      })
    });
    hitokotoData.text = "这里应该显示一句话";
    hitokotoData.from = "無名";
  }
};

// 更新一言数据
const updateHitokoto = () => {
  // 防抖
  debounce(() => {
    getHitokotoData();
  }, 500);
};

onMounted(() => {
  getHitokotoData();
});
</script>

<style lang="scss" scoped>
.hitokoto {
  width: 100%;
  height: 100%;
  padding: 20px;
  animation: fade 0.5s;
  overflow: hidden;
  position: relative;
  max-height: 100%;
  box-sizing: border-box;
  
  .open-music {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00000026;
    padding: 4px 0;
    border-radius: 8px 8px 0 0;
    .i-icon {
      width: 18px;
      height: 18px;
      display: block;
      margin-right: 8px;
    }
    span {
      font-size: 0.95rem;
    }
  }
  
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    max-height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    
    .text {
      font-size: 1.1rem;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.5;
      max-height: calc(1.5em * 3);
      flex: 1;
      margin-bottom: 10px;
    }
    
    .from {
      font-weight: bold;
      align-self: flex-end;
      font-size: 1.1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      flex-shrink: 0;
    }
  }
  
  // 移动端优化
  @media (max-width: 768px) {
    padding: 15px;
    
    .content {
      .text {
        font-size: 1rem;
        -webkit-line-clamp: 2;
        max-height: calc(1.5em * 2);
      }
      .from {
        font-size: 1rem;
      }
    }
  }
  
  // 确保在移动端不会超出屏幕
  @media (max-width: 480px) {
    padding: 12px;
    
    .content {
      .text {
        font-size: 0.9rem;
        -webkit-line-clamp: 2;
        max-height: calc(1.4em * 2);
        line-height: 1.4;
      }
      .from {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
