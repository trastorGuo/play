<template>
    <div>
        <van-uploader
            v-model="fileList"
            :max-count="1"
            image-fit="contain"
            preview-size="1.68rem"
        />
        <div class="button botton-primary" @click="generate">生成</div>
        <div v-if="base64">
            <img :src='base64' class="grey-img"/>
            <div class="button botton-primary" @click="download()">下载</div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import { Toast } from 'vant';
import type { UploaderFileListItem } from 'vant';
import { base64ToImgDom, imgToNewCanvas, downloadBase64 } from '@/common/utils';
import { showLoading } from '@/common/components/hooks';

const fileList = ref<UploaderFileListItem[]>([]);
const base64 = ref('');

function generate() {
    if(fileList.value.length <= 0) {
        Toast.fail('请上传图片');
        return;
    }

    const curImg = base64ToImgDom(fileList.value[0].content!);
    if(!curImg) {
        Toast.fail('图片数据获取失败');
        return;
    }
    if(curImg.width > 900 || curImg.height > 900) {
        Toast.fail('图片宽高需<900');
        return;
    }
    showLoading.value = true;

    setTimeout(() => {
        const canvas = imgToNewCanvas(curImg);
        const dataCtx = canvas.getContext('2d')!;
        console.log(curImg.width, curImg.height);
        const newCavas = imgToStr(dataCtx.getImageData(0, 0, curImg.width, curImg.height).data, curImg.width, curImg.height);
        base64.value = newCavas.toDataURL('image/png');
        showLoading.value = false;
    }, 10);
}

function download() {
    downloadBase64(base64.value);
}

const config = {
    fontSize: 12,
    spaceing: 10
};

const map = (s, a1, a2, b1, b2) => b1 + (s - a1) * (b2 - b1) / (a2 - a1);
// 图片转字符画
function imgToStr(data: Uint8ClampedArray, imgWidth: number, imgHeight: number): HTMLCanvasElement {
    const represenation = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^'. ";
    const newCavans = document.createElement('canvas');
    newCavans.width = imgWidth * config.spaceing;
    newCavans.height = imgHeight * config.spaceing;
    const ctx = newCavans.getContext('2d')!;
    for(let i = 0, ii = 0; i < data.length; i += 4, ii++) {
        const x = ii % imgWidth;
        const y = ii / imgWidth | 0;
        const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3 | 0;
        const char = represenation[map(grayscale, 255, 0, 0, represenation.length - 1) | 0];
        ctx.fillStyle = `rgb(${grayscale},${grayscale},${grayscale})`;
        ctx.font = `${config.fontSize}px Courier New`;
        ctx.fillText(char, x * config.spaceing, y * config.spaceing);
    }
    return newCavans;
}
</script>

<style lang='less' scoped>
.grey-img {
    width: 1.68rem;
    height: 1.68rem;
    object-fit: contain;
    margin-top: .2rem;
}
</style>