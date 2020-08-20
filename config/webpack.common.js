const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { plugins } = require('../postcss.config');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(jpeg|pbg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 2048,
            name: '[name]_[hash].[ext]',
            outputPath: 'image/',
          },
        },
      },
      {
        test: /\.(less)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]', // 编译后类名
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
    new HtmlWebpackPlugin({
      title: 'webpack',
      template: 'src/index.html',
    }),
    new CleanWebpackPlugin(),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
