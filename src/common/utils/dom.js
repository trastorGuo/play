var adjustImgUrl = function (url) { return (url.includes('?') ? "".concat(url, "&share=1") : "".concat(url, "?share=1")); };
export function loadImage(url) {
    return new Promise(function (resolve, reject) {
        var isFirstError = true;
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function () {
            // 做一次图片失败后重试
            if(isFirstError) {
                isFirstError = false;
                // 不走缓存，强行重新请求
                img.src = adjustImgUrl(url);
            }
            else {
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
export function base64ToImgDom(base64) {
    if(!base64) {
        return null;
    }
    var curImg = new Image();
    curImg.src = base64;
    return curImg;
}
/**
 * img dom 画成新的 canvas
 * @param base64
 * @returns
 */
export function imgToNewCanvas(curImg) {
    var newCavans = document.createElement('canvas');
    var ctx = newCavans.getContext('2d');
    ctx.canvas.width = curImg.width;
    ctx.canvas.height = curImg.height;
    ctx.drawImage(curImg, 0, 0, curImg.width, curImg.height);
    return newCavans;
}
// # sourceMappingURL=dom.js.map