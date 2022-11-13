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

    const canvas = imgToNewCanvas(curImg);
    const dataCtx = canvas.getContext('2d')!;
    
    const greyData = greyScale(dataCtx.getImageData(0, 0, curImg.width, curImg.height));
    dataCtx.putImageData(greyData, 0, 0);
    base64.value = canvas.toDataURL('image/png');
}

function download() {
    downloadBase64(base64.value);
}

// 灰度
function greyScale(imgData: ImageData): ImageData {
    // 图片像素数据
    const data = imgData.data;
        let r; let g; let b; let v;
    for(let i = 0, len = data.length; i < len; i += 4) {
        r = data[i]; g = data[i + 1]; b = data[i + 2];
        // 加权取值
        v = .299 * r + .587 * g + .114 * b;
        data[i] = data[i + 1] = data[i + 2] = v;
    }
    return imgData;
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