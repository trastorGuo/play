/// <reference types="vite/client" />
/// <reference types="node" />

// 扩展 Vite 的环境变量类型
interface ImportMetaEnv {
  readonly VITE_APP_SITE_NAME: string
  readonly VITE_APP_SITE_URL: string
  readonly VITE_APP_SITE_AUTHOR: string
  readonly VITE_APP_SITE_START: string
  readonly VITE_APP_SONG_SERVER: string
  readonly VITE_APP_SONG_TYPE: string
  readonly VITE_APP_SONG_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 为了兼容性，也声明 process.env 类型（已通过 Vite define 配置映射）
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VUE_APP_SITE_NAME: string
    readonly VUE_APP_SITE_URL: string
    readonly VUE_APP_SITE_AUTHOR: string
    readonly VUE_APP_SITE_START: string
    readonly VUE_APP_SONG_SERVER: string
    readonly VUE_APP_SONG_TYPE: string
    readonly VUE_APP_SONG_ID: string
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}

// 声明全局变量以避免 undefined 错误
declare global {
  var global: typeof globalThis
  var process: NodeJS.Process
  var Buffer: BufferConstructor
} 