/*
 * @Description: 
 * @Date: 2022-08-14 16:22:30
 * @Author: 
 * @LastEditTime: 2022-08-31 00:27:00
 */
const { defineConfig } = require('@vue/cli-service');
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
    transpileDependencies: false,
    chainWebpack: (config) => {
        config.resolve.alias.set('@', resolve('src'));
    },
    pages: {
        index: {
            entry: "src/main.ts"
        }
    },
    configureWebpack: {
        plugins: [
            ComponentsPlugin({
                resolvers: [VantResolver()]
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
