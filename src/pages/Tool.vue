<template>
    <!-- 顶部导航 -->
    <PageNavigation 
        title="工具页面" 
        subtitle="图片处理工具集合"
        back-path="/"
    />
    
    <div class="tool-page dark-theme">
        <el-tabs v-model="tabActive" type="border-card">
            <el-tab-pane 
                v-for="(item, index) in TabList" 
                :key="index" 
                :label="item.title" 
                :name="index.toString()"
            >
                <div class="tool-content">
                    <div class="upload-area">
                        <el-upload
                            class="upload-demo"
                            drag
                            action=""
                            :auto-upload="false"
                            :on-change="handleFileChange"
                            :show-file-list="false"
                            accept="image/*"
                        >
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">
                                拖拽图片到此处或 <em>点击上传</em>
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    支持 jpg/png 格式的图片文件
                                </div>
                            </template>
                        </el-upload>
                        
                        <div v-if="uploadedImage" class="uploaded-preview">
                            <h4>原图预览：</h4>
                            <img :src="uploadedImage" alt="上传的图片" class="preview-img" />
                        </div>
                    </div>
                    
                    <div class="action-area">
                        <el-button 
                            type="primary" 
                            @click="debounceClick(() => processImage(item.type), 'processImage', 800)"
                            :disabled="!uploadedImage"
                            size="large"
                        >
                            {{ item.buttonText }}
                        </el-button>
                    </div>
                    
                    <div v-if="processedResult" class="result-area">
                        <h4>处理结果：</h4>
                        <div v-if="item.type === 'gray'" class="result-image">
                            <img :src="processedResult" alt="处理后的图片" class="result-img" />
                            <el-button type="success" @click="debounceClick(downloadResult, 'download')">下载图片</el-button>
                        </div>
                        <div v-else-if="item.type === 'char'" class="result-text">
                            <pre>{{ processedResult }}</pre>
                            <el-button type="success" @click="debounceClick(copyResult, 'copyText')">复制文本</el-button>
                        </div>
                        <div v-else-if="item.type === 'hex'" class="result-colors">
                            <div class="color-grid">
                                <div 
                                    v-for="(color, idx) in processedResult" 
                                    :key="idx" 
                                    class="color-item"
                                    :style="{ backgroundColor: color }"
                                    :title="color"
                                >
                                    {{ color }}
                                </div>
                            </div>
                            <el-button type="success" @click="debounceClick(copyColors, 'copyColors')">复制颜色值</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import PageNavigation from '@/components/PageNavigation.vue';
import { debounceClick } from '@/utils/debounce.js';

const tabActive = ref('0');
const uploadedImage = ref('');
const processedResult = ref('');

const TabList = ref([
    {
        type: 'gray',
        title: '图片灰度化',
        buttonText: '转换为灰度图'
    },
    {
        type: 'char',
        title: '图片字符化',
        buttonText: '转换为字符画'
    },
    {
        type: 'hex',
        title: '像素转16进制',
        buttonText: '提取颜色值'
    }
]);

// 处理文件上传
const handleFileChange = (file) => {
    if(file.raw) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.value = e.target.result;
            processedResult.value = '';
        };
        reader.readAsDataURL(file.raw);
    }
};

// 处理图片
const processImage = (type) => {
    if(!uploadedImage.value) {
        ElMessage.warning('请先上传图片');
        return;
    }
    
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        switch(type) {
            case'gray':
                processedResult.value = processToGray(canvas, ctx);
                break;
            case'char':
                processedResult.value = processToChar(canvas, ctx);
                break;
            case'hex':
                processedResult.value = processToHex(canvas, ctx);
                break;
        }
    };
    img.src = uploadedImage.value;
};

// 转换为灰度图
const processToGray = (canvas, ctx) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for(let i = 0; i < data.length; i += 4) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
};

// 转换为字符画
const processToChar = (canvas, ctx) => {
    const chars = '@%#*+=-:. ';
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let result = '';
    
    const step = 8; // 采样步长
    for(let y = 0; y < canvas.height; y += step) {
        for(let x = 0; x < canvas.width; x += step) {
            const index = (y * canvas.width + x) * 4;
            const gray = Math.round(0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2]);
            const charIndex = Math.floor((gray / 255) * (chars.length - 1));
            result += chars[charIndex];
        }
        result += '\n';
    }
    
    return result;
};

// 提取颜色值
const processToHex = (canvas, ctx) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colors = [];
    
    const step = 20; // 采样步长
    for(let y = 0; y < canvas.height; y += step) {
        for(let x = 0; x < canvas.width; x += step) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const hex = '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
            if(!colors.includes(hex)) {
                colors.push(hex);
            }
        }
    }
    
    return colors.slice(0, 50); // 限制颜色数量
};

// 下载结果图片
const downloadResult = () => {
    const link = document.createElement('a');
    link.download = 'processed_image.png';
    link.href = processedResult.value;
    link.click();
};

// 复制文本结果
const copyResult = () => {
    navigator.clipboard.writeText(processedResult.value).then(() => {
        ElMessage.success('已复制到剪贴板');
    });
};

// 复制颜色值
const copyColors = () => {
    const colorText = processedResult.value.join('\n');
    navigator.clipboard.writeText(colorText).then(() => {
        ElMessage.success('已复制颜色值到剪贴板');
    });
};
</script>

<style scoped>
.tool-page {
    padding: 90px 2rem 2rem; /* 为顶部导航留出空间 */
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
}

.tool-header {
    text-align: center;
    margin-bottom: 2rem;
}

.tool-header h2 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.tool-header p {
    font-size: 1.1rem;
    opacity: 0.9;
}

.tool-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.upload-area {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 2rem;
    backdrop-filter: blur(10px);
}

.upload-demo {
    margin-bottom: 2rem;
}

.uploaded-preview h4,
.result-area h4 {
    margin-bottom: 1rem;
    color: #fff;
}

.preview-img,
.result-img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.action-area {
    text-align: center;
}

.result-area {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 2rem;
    backdrop-filter: blur(10px);
}

.result-text pre {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    line-height: 1;
    overflow: auto;
    max-height: 400px;
    white-space: pre;
    color: #fff;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
    margin-bottom: 1rem;
}

.color-item {
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    font-size: 0.9rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .tool-page {
        padding: 70px 1rem 1rem;
    }
    
    .tool-header h2 {
        font-size: 2rem;
    }
    
    .upload-area,
    .result-area {
        padding: 1.5rem;
    }
    
    .color-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
    
    .result-text pre {
        font-size: 0.7rem;
    }
}

@media (max-width: 480px) {
    .tool-page {
        padding: 60px 0.8rem 0.8rem;
    }
    
    .tool-header h2 {
        font-size: 1.5rem;
    }
    
    .upload-area,
    .result-area {
        padding: 1rem;
    }
    
    .color-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }
}
</style>
