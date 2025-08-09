import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { chunkStratagem } from 'vite-plugin-chunk-stratagem';


export default defineConfig({
  define: {
    // 为了兼容旧的 process.env 代码，将 process.env 映射到 import.meta.env
    'process.env.VUE_APP_SITE_NAME': JSON.stringify('trastor'),
    'process.env.VUE_APP_SITE_URL': JSON.stringify('https://www.trastor.com'),
    'process.env.VUE_APP_SITE_AUTHOR': JSON.stringify('trastor'),
    'process.env.VUE_APP_SITE_START': JSON.stringify('2025-01-01'),
    'process.env.VUE_APP_SONG_SERVER': JSON.stringify('netease'),
    'process.env.VUE_APP_SONG_TYPE': JSON.stringify('playlist'),
    'process.env.VUE_APP_SONG_ID': JSON.stringify('8407304077'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // 修复 Node.js 全局变量
    global: 'globalThis',
    'global.process': JSON.stringify({}),
    'global.Buffer': JSON.stringify({})
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true,
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json'
      }
    }),
    Components({
      resolvers: [VantResolver(), ElementPlusResolver()]
    }),
    chunkStratagem()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:6015',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://localhost:6015',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/style/global.scss";`,
        api: 'modern-compiler'
      }
    }
  }
}) 