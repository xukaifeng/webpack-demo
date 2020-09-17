const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const devConfig = {
  mode: 'development',

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].bundle.js',
    publicPath: '/',
  },

  devtool: 'cheap-module-eval-source-map', // 日常

  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:6]', // 模块化，编译后类名
              },
            },
          },
          'postcss-loader', // 添加css前缀
          'less-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', // 添加css前缀
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          'Project is running at: ',
          '\033[32m http://localhost:' + process.env.PORT + ' \033[0m',
          '\033[32m http://127.0.0.1:' + process.env.PORT + ' \033[0m',
        ],
      },
      onErrors: function (severity, errors) {
        // You can listen to errors transformed and prioritized by the plugin
        // severity can be 'error' or 'warning'
      },
    }),
  ],

  devServer: {
    contentBase: './dist',
    // open: true,
    port: process.env.PORT,
    hot: true,
    overlay: true, // 编译出现错误时，将错误直接显示在页面上
    stats: 'errors-only',
  },

  stats: 'none',
};

module.exports = merge(commonConfig, devConfig);
