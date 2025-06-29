// 防抖函数映射，每个函数名对应一个timeout
const debounceTimeouts = new Map();

// 通用防抖函数，支持直接在点击事件中使用（立即执行版本）
function debounceClick(func, key = 'default', delay = 500) {
  // 如果没有提供key，使用函数名或随机key
  if (key === 'default' && func.name) {
    key = func.name;
  } else if (key === 'default') {
    key = Math.random().toString(36).substr(2, 9);
  }
  
  // 如果当前没有在防抖状态，立即执行函数
  if (!debounceTimeouts.has(key)) {
    func();
    
    // 设置防抖锁定期，在此期间忽略后续点击
    const timeoutId = setTimeout(() => {
      debounceTimeouts.delete(key);
    }, delay);
    
    debounceTimeouts.set(key, timeoutId);
  }
  // 如果在防抖期内，忽略这次点击
}

// 原有的防抖函数保持不变，用于兼容性
let timeout;

function debounce(func, wait = 300, immediate = false) {
  // 清除定时器
  if(timeout !== null) {
    clearTimeout(timeout);
  }
  // 立即执行
  if(immediate) {
    var callNow = !timeout;
    timeout = setTimeout(function () {
      timeout = null;
    }, wait);
    if(callNow) typeof func === "function" && func();
  } else {
    timeout = setTimeout(function () {
      typeof func === "function" && func();
    }, wait);
  }
}

// 导出
export default debounce;
export { debounceClick };
