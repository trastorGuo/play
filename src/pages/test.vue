
<template>
    <!-- <div @click="download('#ascii')">下载</div> -->
    <button @click="download('#ascii')">下载</button>
    <canvas id="ascii" ref="canvas" width="400" height="400"></canvas>
</template>

<script lang='ts' setup>
import { loadImage } from '../common/utils';
import { onMounted, ref } from 'vue';

function download(selector) {
  // 通过 API 获取目标 canvas 元素
  const canvas = document.querySelector(selector);

  // 创建一个 a 标签，并设置 href 和 download 属性
  const el = document.createElement('a');
  // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
  el.href = canvas.toDataURL();
  el.download = '文件名称';
  
  // 创建一个点击事件并对 a 标签进行触发
  const event = new MouseEvent('click');
  el.dispatchEvent(event);
}

const canvas = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D | null>(null);

// onMounted(async () => {
//     // const background = await loadImage('https://static.yximgs.com/udata/pkg/KS-GAME-WEB/601832.b3ba5d4c233dc7d3.jpg', false);
//     const background = await loadImage('https://static.yximgs.com/udata/pkg/KS-GAME-WEB/review_group/backWhiteIcon.8ac0bea081249d56.png', false);
//     document.body.appendChild(background);

//     const dataCtx = document.createElement('canvas').getContext('2d')!;
//     dataCtx.drawImage(background, 0, 0, background.width, background.height);
//     const imageData = dataCtx.getImageData(0, 0, background.width, background.height);

//     ctx.value = canvas.value!.getContext('2d');
//     imgToStr(imageData, ctx.value!);
// });

// // 灰度
// function greyScale(imgData) {
//     // 图片像素数据
//     const data = imgData.data;
//         let r; let g; let b; let v;
//     for(let i = 0, len = data.length; i < len; i += 4) {
//         r = data[i]; g = data[i + 1]; b = data[i + 2];
//         // 加权取值
//         v = .299 * r + .587 * g + .114 * b;
//         data[i] = data[i + 1] = data[i + 2] = v;
//     }
//     return imgData;
// }

// const map = (s, a1, a2, b1, b2) => b1 + (s - a1) * (b2 - b1) / (a2 - a1);

// // 灰度
// function imgToStr(imgData, ctx: CanvasRenderingContext2D) {
//     const data = imgData.data;
//     // eslint-disable-next-line no-useless-escape
//     const represenation = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^'. ";
//     for(let i = 0, ii = 0; i < data.length; i += 4, ii++) {
//         const x = ii % imgData.width;
//         const y = ii / imgData.width;
//         const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3 | 0;
//         const char = represenation[map(grayscale, 255, 0, 0, represenation.length - 1) | 0];
//         ctx.fillStyle = `#000`;
//         // ctx.fillStyle = `rgb(${grayscale},${grayscale},${grayscale})`;
//         ctx.font = `2px Courier New`;
//         console.log(char, x, y);
//         ctx.fillText('1', x, y);
//     }

//     // ctx.font = `20px 'Arial`;
//     // ctx.fillStyle = '#000';
//     // ctx.font = `20px Courier New`;
//     // ctx.fillText('sjakljwsakljiklos', 10, 10);
// }
const map = (s, a1, a2, b1, b2) => b1 + (s - a1) * (b2 - b1) / (a2 - a1);

onMounted(() => {
    print({
        canvas: document.getElementById('ascii'),
        // image: 'https://static.yximgs.com/udata/pkg/KS-GAME-WEB/WechatIMG81.8d0ba0727d704c1c.jpeg',
        // image: 'https://static.yximgs.com/udata/pkg/KS-GAME-WEB/601832.b3ba5d4c233dc7d3.jpg',
        image: 'https://static.yximgs.com/udata/pkg/KS-GAME-WEB/Snipaste_2022-11-12_16-55-58.f6b523268af40a84.png',
        fontSize: 8,
        spaceing: 35
    });
});


function print(config) {
    const original = new Image();
    original.crossOrigin = 'Anonymous';
    original.onload = function() {
        const cavans = document.createElement('canvas');
        const dataCtx = cavans.getContext('2d')!;
        config.canvas.width = dataCtx.canvas.width = original.width * config.spaceing;
        config.canvas.height = dataCtx.canvas.height = original.height * config.spaceing;

        dataCtx.drawImage(original, 0, 0, original.width, original.height);
        // document.body.appendChild(cavans);
        const data = dataCtx.getImageData(0, 0, original.width, original.height).data;
        console.log(original.width, original.height, data.length);
        const ctx = config.canvas.getContext('2d');
        ctx.fillStyle = '#fff';

        const represenation = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^'. ";

        for(let i = 0, ii = 0; i < data.length; i += 4, ii++) {
            const x = ii % original.width;
            const y = ii / original.width | 0;
            const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3 | 0;
            const char = represenation[map(grayscale, 255, 0, 0, represenation.length - 1) | 0];
            // if(char === '.') {
            //     continue;
            // }
            // ctx.fillStyle = `rgb(${grayscale},${grayscale},${grayscale})`;
            
            ctx.fillStyle = "#FFFFFF";
            ctx.font = `${config.fontSize}px Courier New`;
            ctx.fillText(colorHex(`rgb(${data[i]},${data[i + 1]},${data[i + 2]})`), x * config.spaceing, y * config.spaceing);

            ctx.fillStyle = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
            ctx.fillRect(x * config.spaceing, y * config.spaceing, config.spaceing, config.spaceing);
            // ctx.fillText(char, x * config.spaceing, y * config.spaceing);
        }

    };

    original.src = config.image;
}

 function colorHex(color: string) {
    // 十六进制颜色值的正则表达式
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
