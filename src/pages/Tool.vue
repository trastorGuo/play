<template>
    <div>
        <van-tabs v-model:active="tabActive" swipeable>
            <van-tab v-for="item in TabList" :title="item.title">
                <component :is="item.com"></component>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import ImgToGray from '@/components/tool/ImgToGray.vue';
import ImgToStr from '@/components/tool/ImgToStr.vue';
import ImgTo16 from '@/components/tool/ImgTo16.vue';
const tabActive = ref(0);

const TabList = ref([{
        com: ImgToGray,
        title: '图片灰度化'
    }, {
        com: ImgToStr,
        title: '图片字符化'
    }, {
        com: ImgTo16,
        title: '像素转16进制'
    }
]);
</script>

<style lang='less' scoped>
.van-swipe-item {
    font-size: .12rem;
}

:deep(.van-tabs__content) {
    padding: .2rem;
}
</style>