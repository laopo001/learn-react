var webpack = require('webpack');
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
module.exports = {

    //页面入口文件配置
    entry: {
        index: './src/index.ts'
    },
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    //插件项
    plugins: [
        new BrowserSyncPlugin({
            // host: 'localhost',
            // port: 3000, //代理后访问的端口
            // proxy: 'localhost:80',//要代理的端口
            host: 'localhost',
            port: 5000,
            server: { baseDir: [''] }
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
    ],
    module: {
        //加载器配置
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    // //其它解决方案配置
    // resolve: {
    //     root: 'E:/github/flux-example/src', //绝对路径
    //     extensions: ['', '.js', '.json', '.scss'],
    //     alias: {
    //         AppStore : 'js/stores/AppStores.js',
    //         ActionType : 'js/actions/ActionType.js',
    //         AppAction : 'js/actions/AppAction.js'
    //     }
    // }
};