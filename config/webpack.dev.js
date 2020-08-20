const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devConfig = {
  mode: 'development',

  devtool: 'cheap-module-eval-source-map', // 日常

  plugins: [new webpack.HotModuleReplacementPlugin()],

  // optimization: {
  //   usedExports: true, // 在开发环境使用Tree Sharking
  // },
  devServer: {
    contentBase: './dist',
    open: true,
    port: 7001,
    hot: true,
  },
};

module.exports = merge(commonConfig, devConfig);
