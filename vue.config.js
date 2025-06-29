/*
 * @Description: 
 * @Date: 2022-08-14 16:22:30
 * @Author: 
 * @LastEditTime: 2022-08-31 00:27:00
 */
const { defineConfig } = require('@vue/cli-service');
const { VantResolver, ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');
const AutoImport = require('unplugin-auto-import/webpack');

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
    transpileDependencies: false,
    chainWebpack: (config) => {
        config.resolve.alias.set('@', resolve('src'));
    },
    devServer: {
        allowedHosts: ['localhost'],
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://localhost:6015',
                changeOrigin: true,
                secure: false,
                logLevel: 'debug'
            },
            '/socket.io': {
                target: 'http://localhost:6015',
                changeOrigin: true,
                secure: false,
                ws: true,
                logLevel: 'debug'
            }
        },
        historyApiFallback: true
    },
    pages: {
        index: {
            entry: "src/main.js"
        }
    },
    configureWebpack: {
        plugins: [
            AutoImport({
                imports: ['vue', 'vue-router'],
                dts: true,
                resolvers: [ElementPlusResolver()],
                eslintrc: {
                    enabled: true,
                    filepath: './.eslintrc-auto-import.json'
                }
            }),
            ComponentsPlugin({
                resolvers: [VantResolver(), ElementPlusResolver()]
            })
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }
            ]
        }
    }
});
