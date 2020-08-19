const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const prodConfig = {
  mode: 'production',
  devtool: 'cheap-eval-source-map', // 生产
};

module.exports = merge(commonConfig, prodConfig);
