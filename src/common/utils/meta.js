/**
 * 页面 Meta 信息管理工具
 */
import { onMounted, onUnmounted } from 'vue';

/**
 * 自动生成SVG图标
 * @param {string} iconType - 图标类型
 * @param {string} bgColor - 背景颜色
 * @param {number} size - 图标尺寸
 */
function generateSVGIcon(iconType, bgColor = '#4F46E5', size = 512) {
  const iconSvg = getIconSVG(iconType, size, bgColor);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(bgColor, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad1)" rx="${size * 0.15}"/>
      ${iconSvg}
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

/**
 * 调整颜色亮度
 */
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  const finalR = Math.max(0, Math.min(255, R));
  const finalG = Math.max(0, Math.min(255, G));
  const finalB = Math.max(0, Math.min(255, B));
  return '#' + (0x1000000 + finalR * 0x10000 + finalG * 0x100 + finalB).toString(16).slice(1);
}

/**
 * 获取不同类型的图标SVG
 */
function getIconSVG(iconType, size, bgColor = '#4F46E5') {
  const center = size / 2;
  const iconSize = size * 0.4;
  const iconColor = '#FFFFFF';
  
  switch(iconType) {
    case 'home':
      return `
        <g transform="translate(${center - iconSize / 2}, ${center - iconSize / 2})">
          <path d="M${iconSize / 2} 0 
                   L${iconSize} ${iconSize * 0.4} 
                   L${iconSize * 0.8} ${iconSize * 0.4} 
                   L${iconSize * 0.8} ${iconSize} 
                   L${iconSize * 0.2} ${iconSize} 
                   L${iconSize * 0.2} ${iconSize * 0.4} 
                   L0 ${iconSize * 0.4} Z" fill="${iconColor}"/>
          <rect x="${iconSize * 0.35}" y="${iconSize * 0.55}" width="${iconSize * 0.15}" height="${iconSize * 0.25}" fill="${iconColor}"/>
          <rect x="${iconSize * 0.55}" y="${iconSize * 0.6}" width="${iconSize * 0.12}" height="${iconSize * 0.12}" fill="${iconColor}"/>
        </g>
      `;
      
    case 'tool':
      return `
        <g transform="translate(${center - iconSize / 2}, ${center - iconSize / 2})">
          <rect x="${iconSize * 0.1}" y="${iconSize * 0.3}" width="${iconSize * 0.15}" height="${iconSize * 0.4}" rx="${iconSize * 0.02}" fill="${iconColor}"/>
          <circle cx="${iconSize * 0.35}" cy="${iconSize * 0.35}" r="${iconSize * 0.08}" fill="${iconColor}"/>
          <rect x="${iconSize * 0.45}" y="${iconSize * 0.2}" width="${iconSize * 0.4}" height="${iconSize * 0.1}" rx="${iconSize * 0.02}" fill="${iconColor}"/>
          <rect x="${iconSize * 0.5}" y="${iconSize * 0.4}" width="${iconSize * 0.3}" height="${iconSize * 0.08}" rx="${iconSize * 0.02}" fill="${iconColor}"/>
          <path d="M${iconSize * 0.6} ${iconSize * 0.6} L${iconSize * 0.8} ${iconSize * 0.6} L${iconSize * 0.9} ${iconSize * 0.8} L${iconSize * 0.7} ${iconSize * 0.8} Z" fill="${iconColor}"/>
        </g>
      `;
      
    case 'cardGame':
      return `
        <g transform="translate(${center - iconSize / 2}, ${center - iconSize / 2})">
          <!-- 扑克牌 -->
          <rect x="${iconSize * 0.1}" y="${iconSize * 0.2}" width="${iconSize * 0.25}" height="${iconSize * 0.35}" rx="${iconSize * 0.03}" fill="${iconColor}"/>
          <rect x="${iconSize * 0.2}" y="${iconSize * 0.15}" width="${iconSize * 0.25}" height="${iconSize * 0.35}" rx="${iconSize * 0.03}" fill="${iconColor}" opacity="0.8"/>
          <rect x="${iconSize * 0.3}" y="${iconSize * 0.1}" width="${iconSize * 0.25}" height="${iconSize * 0.35}" rx="${iconSize * 0.03}" fill="${iconColor}" opacity="0.6"/>
          
          <!-- 筹码 -->
          <circle cx="${iconSize * 0.7}" cy="${iconSize * 0.7}" r="${iconSize * 0.12}" fill="${iconColor}"/>
          <circle cx="${iconSize * 0.65}" cy="${iconSize * 0.65}" r="${iconSize * 0.12}" fill="${iconColor}" opacity="0.8"/>
          <circle cx="${iconSize * 0.6}" cy="${iconSize * 0.6}" r="${iconSize * 0.12}" fill="${iconColor}" opacity="0.6"/>
        </g>
      `;
      
    case 'room':
      return `
        <g transform="translate(${center - iconSize / 2}, ${center - iconSize / 2})">
          <!-- 房间 -->
          <rect x="${iconSize * 0.15}" y="${iconSize * 0.25}" width="${iconSize * 0.7}" height="${iconSize * 0.6}" rx="${iconSize * 0.05}" fill="${iconColor}"/>
          <!-- 门 -->
          <rect x="${iconSize * 0.7}" y="${iconSize * 0.5}" width="${iconSize * 0.1}" height="${iconSize * 0.25}" fill="${adjustBrightness(bgColor, -40)}"/>
          <!-- 窗户 -->
          <rect x="${iconSize * 0.25}" y="${iconSize * 0.35}" width="${iconSize * 0.15}" height="${iconSize * 0.12}" fill="${adjustBrightness(bgColor, -40)}"/>
          <rect x="${iconSize * 0.45}" y="${iconSize * 0.35}" width="${iconSize * 0.15}" height="${iconSize * 0.12}" fill="${adjustBrightness(bgColor, -40)}"/>
          <!-- 人物图标 -->
          <circle cx="${iconSize * 0.3}" cy="${iconSize * 0.65}" r="${iconSize * 0.04}" fill="${adjustBrightness(bgColor, -40)}"/>
          <circle cx="${iconSize * 0.5}" cy="${iconSize * 0.65}" r="${iconSize * 0.04}" fill="${adjustBrightness(bgColor, -40)}"/>
          <circle cx="${iconSize * 0.7}" cy="${iconSize * 0.65}" r="${iconSize * 0.04}" fill="${adjustBrightness(bgColor, -40)}"/>
        </g>
      `;
      
    default:
      return `<circle cx="${center}" cy="${center}" r="${iconSize / 2}" fill="${iconColor}"/>`;
  }
}

/**
 * 获取页面图标
 * @param {string} pageKey - 页面标识
 */
export function getPageIcon(pageKey) {
  const iconConfigs = {
    home: { bgColor: '#4F46E5' },
    tool: { bgColor: '#059669' },
    cardGame: { bgColor: '#DC2626' },
    room: { bgColor: '#7C3AED' }
  };
  
  const config = iconConfigs[pageKey] || iconConfigs.home;
  return generateSVGIcon(pageKey, config.bgColor);
}

// 默认的 Meta 信息
const defaultMeta = {
  title: 'trastor 主页',
  description: 'trastor的个人主页，分享生活点滴，记录美好时光。提供工具集合、打牌记账等实用功能。',
  keywords: 'trastor主页,trastor,个人主页,工具集合,打牌记账',
  image: getPageIcon('home'),
  url: 'https://www.6rem.com/',
  favicon: '/images/icon/favicon.ico'
};

/**
 * 更新页面标题
 * @param {string} title - 页面标题
 */
export function updateTitle(title) {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
}

/**
 * 更新或创建 meta 标签
 * @param {string} name - meta 标签的 name 或 property
 * @param {string} content - meta 标签的内容
 * @param {string} type - 标签类型 ('name' 或 'property')
 */
export function updateMeta(name, content, type = 'name') {
  if (typeof document === 'undefined') return;
  
  const selector = type === 'property' ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector(selector);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(type, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

/**
 * 更新网站图标
 * @param {string} iconUrl - 图标URL
 */
export function updateFavicon(iconUrl) {
  if (typeof document === 'undefined') return;
  
  // 更新主要的 favicon
  let favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
  if (favicon) {
    favicon.href = iconUrl;
  }
  
  // 更新 apple-touch-icon
  let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (appleTouchIcon && iconUrl.endsWith('.svg')) {
    // 如果是 SVG，使用对应的 PNG 版本
    appleTouchIcon.href = iconUrl.replace('.svg', '.png');
  }
}

/**
 * 设置页面的完整 Meta 信息
 * @param {Object} metaInfo - Meta 信息对象
 * @param {string} metaInfo.title - 页面标题
 * @param {string} metaInfo.description - 页面描述
 * @param {string} metaInfo.keywords - 页面关键词
 * @param {string} metaInfo.image - 分享图片URL
 * @param {string} metaInfo.url - 页面URL
 * @param {string} metaInfo.favicon - 网站图标URL
 */
export function setPageMeta(metaInfo = {}) {
  const meta = { ...defaultMeta, ...metaInfo };
  
  // 更新页面标题
  updateTitle(meta.title);
  
  // 更新网站图标
  if (meta.favicon) {
    updateFavicon(meta.favicon);
  }
  
  // 更新基本 meta 标签
  updateMeta('description', meta.description);
  updateMeta('keywords', meta.keywords);
  
  // 更新 Open Graph 标签
  updateMeta('og:type', 'website', 'property');
  updateMeta('og:title', meta.title, 'property');
  updateMeta('og:description', meta.description, 'property');
  updateMeta('og:image', meta.image, 'property');
  updateMeta('og:image:width', '512', 'property');
  updateMeta('og:image:height', '512', 'property');
  updateMeta('og:url', meta.url, 'property');
  updateMeta('og:locale', 'zh_CN', 'property');
  updateMeta('og:site_name', 'trastor 主页', 'property');
  
  // 更新 Twitter 标签
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', meta.title);
  updateMeta('twitter:description', meta.description);
  updateMeta('twitter:image', meta.image);
  updateMeta('twitter:url', meta.url);
  updateMeta('twitter:creator', '@trastor');
}

/**
 * 重置为默认 Meta 信息
 */
export function resetPageMeta() {
  setPageMeta(defaultMeta);
}

/**
 * 预定义的页面 Meta 配置
 */
export const pageMetas = {
  home: {
    title: 'trastor 主页',
    description: 'trastor的个人主页，分享生活点滴，记录美好时光。提供工具集合、打牌记账等实用功能。',
    keywords: 'trastor主页,trastor,个人主页,工具集合,打牌记账',
    image: getPageIcon('home'),
    url: 'https://www.trastor.com/',
    favicon: getPageIcon('home')
  },
  
  tool: {
    title: '工具页面 - trastor 主页',
    description: '实用工具集合：图片灰度化、图片字符化、像素转16进制等图片处理工具。简单易用，功能强大。',
    keywords: '图片处理,工具集合,灰度化,字符画,16进制,像素处理,trastor',
    image: getPageIcon('tool'),
    url: 'https://www.trastor.com/tool',
    favicon: getPageIcon('tool')
  },
  
  cardGame: {
    title: '打牌记账 - trastor 主页',
    description: '和朋友一起记录每一局输赢，支持多人房间、实时同步，让打牌更有趣。创建房间邀请好友，轻松管理游戏记录。',
    keywords: '打牌记账,游戏记录,多人房间,实时同步,扑克游戏,麻将记账,trastor',
    image: getPageIcon('cardGame'),
    url: 'https://www.trastor.com/card-game',
    favicon: getPageIcon('cardGame')
  },
  
  room: {
    title: '游戏房间 - 打牌记账',
    description: '加入游戏房间，和朋友一起记录游戏输赢，实时同步数据。支持多人在线，操作简单便捷。',
    keywords: '游戏房间,打牌记账,多人游戏,实时同步,在线房间,trastor',
    image: getPageIcon('room'),
    url: 'https://www.trastor.com/room',
    favicon: getPageIcon('room')
  }
};

/**
 * Vue Composable: 使用页面 Meta
 * @param {string} pageKey - 页面标识符
 * @param {Object} customMeta - 自定义 Meta 信息
 */
export function usePageMeta(pageKey, customMeta = {}) {
  // 避免在服务器端执行
  if (typeof window === 'undefined') {
    return {
      setPageMeta: () => {},
      updateTitle: () => {},
      updateMeta: () => {}
    };
  }
  
  // Vue 的生命周期钩子已在文件顶部导入
  
  onMounted(() => {
    const baseMeta = pageMetas[pageKey] || pageMetas.home;
    setPageMeta({ ...baseMeta, ...customMeta });
  });
  
  onUnmounted(() => {
    // 页面离开时重置为默认 Meta
    resetPageMeta();
  });
  
  return {
    setPageMeta,
    updateTitle,
    updateMeta,
    updateFavicon
  };
} 