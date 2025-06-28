/**
 * 下载base64 图片
 * @param base64
 */
export function downloadBase64(base64) {
    // 创建一个 a 标签，并设置 href 和 download 属性
    var el = document.createElement('a');
    // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
    el.href = base64;
    el.download = new Date().getTime().toString();
    // 创建一个点击事件并对 a 标签进行触发
    var event = new MouseEvent('click');
    el.dispatchEvent(event);
}
// # sourceMappingURL=ability.js.map