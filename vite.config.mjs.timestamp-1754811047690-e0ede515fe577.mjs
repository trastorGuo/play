// vite.config.mjs
import { defineConfig } from "file:///Users/trastor/code/play/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/trastor/code/play/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import AutoImport from "file:///Users/trastor/code/play/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/trastor/code/play/node_modules/unplugin-vue-components/dist/vite.mjs";
import { VantResolver, ElementPlusResolver } from "file:///Users/trastor/code/play/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { chunkStratagem } from "file:///Users/trastor/code/play/node_modules/vite-plugin-chunk-stratagem/dist/index.js";
import { createHash } from "crypto";
var __vite_injected_original_dirname = "/Users/trastor/code/play";
if (!global.crypto) {
  global.crypto = {
    hash: createHash
  };
}
var vite_config_default = defineConfig({
  define: {
    // 同时支持 process.env 和 import.meta.env
    "process.env.VUE_APP_SITE_NAME": JSON.stringify("trastor"),
    "process.env.VUE_APP_SITE_URL": JSON.stringify("https://www.trastor.com"),
    "process.env.VUE_APP_SITE_AUTHOR": JSON.stringify("trastor"),
    "process.env.VUE_APP_SITE_START": JSON.stringify("2025-01-01"),
    "process.env.VUE_APP_SONG_SERVER": JSON.stringify("netease"),
    "process.env.VUE_APP_SONG_TYPE": JSON.stringify("playlist"),
    "process.env.VUE_APP_SONG_ID": JSON.stringify("8407304077"),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    // import.meta.env 变量
    "import.meta.env.VITE_APP_SITE_NAME": JSON.stringify("trastor"),
    "import.meta.env.VITE_APP_SITE_URL": JSON.stringify("https://www.trastor.com"),
    "import.meta.env.VITE_APP_SITE_AUTHOR": JSON.stringify("trastor"),
    "import.meta.env.VITE_APP_SITE_START": JSON.stringify("2025-01-01"),
    "import.meta.env.VITE_APP_SONG_SERVER": JSON.stringify("netease"),
    "import.meta.env.VITE_APP_SONG_TYPE": JSON.stringify("playlist"),
    "import.meta.env.VITE_APP_SONG_ID": JSON.stringify("8407304077"),
    // 修复 Node.js 全局变量
    global: "globalThis",
    "global.process": JSON.stringify({}),
    "global.Buffer": JSON.stringify({})
  },
  optimizeDeps: {
    exclude: ["@vitejs/plugin-vue"]
  },
  esbuild: {
    target: "esnext"
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
      dts: true,
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json"
      }
    }),
    Components({
      resolvers: [VantResolver(), ElementPlusResolver()]
    }),
    chunkStratagem()
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    port: 8080,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:6015",
        changeOrigin: true,
        secure: false
      },
      "/socket.io": {
        target: "http://localhost:6015",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/style/global.scss";`,
        api: "modern-compiler"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3RyYXN0b3IvY29kZS9wbGF5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdHJhc3Rvci9jb2RlL3BsYXkvdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy90cmFzdG9yL2NvZGUvcGxheS92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgVmFudFJlc29sdmVyLCBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IHsgY2h1bmtTdHJhdGFnZW0gfSBmcm9tICd2aXRlLXBsdWdpbi1jaHVuay1zdHJhdGFnZW0nXG5pbXBvcnQgeyBjcmVhdGVIYXNoIH0gZnJvbSAnY3J5cHRvJ1xuXG4vLyBOb2RlLmpzIHYyMyBcdTUxN0NcdTVCQjlcdTYwMjdcdTRGRUVcdTU5MERcbmlmICghZ2xvYmFsLmNyeXB0bykge1xuICBnbG9iYWwuY3J5cHRvID0ge1xuICAgIGhhc2g6IGNyZWF0ZUhhc2hcbiAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGRlZmluZToge1xuICAgIC8vIFx1NTQwQ1x1NjVGNlx1NjUyRlx1NjMwMSBwcm9jZXNzLmVudiBcdTU0OEMgaW1wb3J0Lm1ldGEuZW52XG4gICAgJ3Byb2Nlc3MuZW52LlZVRV9BUFBfU0lURV9OQU1FJzogSlNPTi5zdHJpbmdpZnkoJ3RyYXN0b3InKSxcbiAgICAncHJvY2Vzcy5lbnYuVlVFX0FQUF9TSVRFX1VSTCc6IEpTT04uc3RyaW5naWZ5KCdodHRwczovL3d3dy50cmFzdG9yLmNvbScpLFxuICAgICdwcm9jZXNzLmVudi5WVUVfQVBQX1NJVEVfQVVUSE9SJzogSlNPTi5zdHJpbmdpZnkoJ3RyYXN0b3InKSxcbiAgICAncHJvY2Vzcy5lbnYuVlVFX0FQUF9TSVRFX1NUQVJUJzogSlNPTi5zdHJpbmdpZnkoJzIwMjUtMDEtMDEnKSxcbiAgICAncHJvY2Vzcy5lbnYuVlVFX0FQUF9TT05HX1NFUlZFUic6IEpTT04uc3RyaW5naWZ5KCduZXRlYXNlJyksXG4gICAgJ3Byb2Nlc3MuZW52LlZVRV9BUFBfU09OR19UWVBFJzogSlNPTi5zdHJpbmdpZnkoJ3BsYXlsaXN0JyksXG4gICAgJ3Byb2Nlc3MuZW52LlZVRV9BUFBfU09OR19JRCc6IEpTT04uc3RyaW5naWZ5KCc4NDA3MzA0MDc3JyksXG4gICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuTk9ERV9FTlYpLFxuICAgIC8vIGltcG9ydC5tZXRhLmVudiBcdTUzRDhcdTkxQ0ZcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBQX1NJVEVfTkFNRSc6IEpTT04uc3RyaW5naWZ5KCd0cmFzdG9yJyksXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0FQUF9TSVRFX1VSTCc6IEpTT04uc3RyaW5naWZ5KCdodHRwczovL3d3dy50cmFzdG9yLmNvbScpLFxuICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9BUFBfU0lURV9BVVRIT1InOiBKU09OLnN0cmluZ2lmeSgndHJhc3RvcicpLFxuICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9BUFBfU0lURV9TVEFSVCc6IEpTT04uc3RyaW5naWZ5KCcyMDI1LTAxLTAxJyksXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0FQUF9TT05HX1NFUlZFUic6IEpTT04uc3RyaW5naWZ5KCduZXRlYXNlJyksXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0FQUF9TT05HX1RZUEUnOiBKU09OLnN0cmluZ2lmeSgncGxheWxpc3QnKSxcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBQX1NPTkdfSUQnOiBKU09OLnN0cmluZ2lmeSgnODQwNzMwNDA3NycpLFxuICAgIC8vIFx1NEZFRVx1NTkwRCBOb2RlLmpzIFx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlxuICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICAgICdnbG9iYWwucHJvY2Vzcyc6IEpTT04uc3RyaW5naWZ5KHt9KSxcbiAgICAnZ2xvYmFsLkJ1ZmZlcic6IEpTT04uc3RyaW5naWZ5KHt9KVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ0B2aXRlanMvcGx1Z2luLXZ1ZSddXG4gIH0sXG4gIGVzYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlc25leHQnXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInXSxcbiAgICAgIGR0czogdHJ1ZSxcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgICBlc2xpbnRyYzoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBmaWxlcGF0aDogJy4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb24nXG4gICAgICB9XG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtWYW50UmVzb2x2ZXIoKSwgRWxlbWVudFBsdXNSZXNvbHZlcigpXVxuICAgIH0pLFxuICAgIGNodW5rU3RyYXRhZ2VtKClcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcbiAgICB9XG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDgwODAsXG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo2MDE1JyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlXG4gICAgICB9LFxuICAgICAgJy9zb2NrZXQuaW8nOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NjAxNScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgd3M6IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XSdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAdXNlIFwiQC9zdHlsZS9nbG9iYWwuc2Nzc1wiO2AsXG4gICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcidcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pICJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFAs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
