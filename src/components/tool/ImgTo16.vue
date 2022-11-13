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
        const newCavas = imgToStr(dataCtx.getImageData(0, 0, curImg.width, curImg.height).data, curImg.width, curImg.height);
        base64.value = newCavas.toDataURL('image/png');
        showLoading.value = false;
        Toast.success({
            message: '生成成功',
            duration: 3000
        });
    }, 10);
}

function download() {
    showLoading.value = true;
    setTimeout(() => {
        downloadBase64(base64.value);
        showLoading.value = false;
    }, 10);
}

const config = {
    fontSize: 8,
    spaceing: 35
};

// 图片转字符画
function imgToStr(data: Uint8ClampedArray, imgWidth: number, imgHeight: number): HTMLCanvasElement {
    const newCavans = document.createElement('canvas');
    newCavans.width = imgWidth * config.spaceing;
    newCavans.height = imgHeight * config.spaceing;
    const ctx = newCavans.getContext('2d')!;
    for(let i = 0, ii = 0; i < data.length; i += 4, ii++) {
        const x = ii % imgWidth;
        const y = ii / imgWidth | 0;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `${config.fontSize}px Courier New`;
        ctx.fillText(colorHex(`rgb(${data[i]},${data[i + 1]},${data[i + 2]})`), x * config.spaceing, y * config.spaceing);

        ctx.fillStyle = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
        ctx.fillRect(x * config.spaceing, y * config.spaceing, config.spaceing, config.spaceing);
    }
    return newCavans;
}

// 十六进制颜色值的正则表达式
function colorHex(color: string) {
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是rgb颜色表示
    if(/^(rgb|RGB)/.test(color)) {
        const aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for(let i = 0; i < aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
            if(hex.length < 2) {
                hex = '0' + hex;
            }
            strHex += hex;
        }
        if(strHex.length !== 7) {
            strHex = color;
        }
        return strHex;
    }if(reg.test(color)) {
        const aNum = color.replace(/#/, "").split("");
        if(aNum.length === 6) {
            return color;
        }if(aNum.length === 3) {
            let numHex = "#";
            for(let i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    return color;
};
</script>

<style lang='less' scoped>
.grey-img {
    width: 1.68rem;
    height: 1.68rem;
    object-fit: contain;
    margin-top: .2rem;
}
</style>