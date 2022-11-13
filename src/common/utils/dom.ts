const adjustImgUrl = (url: string) => (url.includes('?') ? `${url}&share=1` : `${url}?share=1`);
export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let isFirstError = true;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            resolve(img);
        };

        img.onerror = () => {
            // 做一次图片失败后重试
            if(isFirstError) {
                isFirstError = false;
                // 不走缓存，强行重新请求
                img.src = adjustImgUrl(url);
            } else {
                reject(new Error('图片获取失败'));
            }
        };
        // 头像图用的地方比较多，不可控，针对头像图拼query，保证不走缓存
        img.src = adjustImgUrl(url);
    });
}

/**
 * 图片 base64 转成 img dom
 * @param base64
 * @returns 
 */
export function base64ToImgDom(base64: string): HTMLImageElement | null {
    if(!base64) {
        return null;
    }
    const curImg = new Image();
    curImg.src = base64;
    return curImg;
}

/**
 * img dom 画成新的 canvas
 * @param base64
 * @returns 
 */
export function imgToNewCanvas(curImg: HTMLImageElement): HTMLCanvasElement {
    const newCavans = document.createElement('canvas');
    const ctx = newCavans.getContext('2d')!;
    ctx.canvas.width = curImg.width;
    ctx.canvas.height = curImg.height;
    ctx.drawImage(curImg, 0, 0, curImg.width, curImg.height);
    return newCavans;
}
