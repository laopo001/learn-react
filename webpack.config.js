var webpack = require('webpack');
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {

    //页面入口文件配置
    entry: {
        index: './demo/index'
    },
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    //插件项
    plugins: [
        new BrowserSyncPlugin({
            // proxy: 'localhost:80',//要代理的端口
            host: 'localhost',
            port: 5000,
            server: { baseDir: ['build'] }
        }),

    ],
    module: {
        //加载器配置
        loaders: [
            {
                test: /\.tsx?$/, loader: 'ts-loader', options: {
                    configFile: 'tsconfig.json'
                }
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'react': 'treact',
            'react-dom': 'treact'
        }
    },
    devtool: 'source-map'
};