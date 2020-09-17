const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackBar = require('webpackbar');

module.exports = {
  entry: {
    index: './src/index.tsx',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: '[name].[contenthash:8].[ext]',
            outputPath: 'fonts/',
          },
        },
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 10,
            name: '[name]_[contenthash:8].[ext]',
            outputPath: 'image/',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.less', '.css', '.json'],
    plugins: [
      // 将 tsconfig.json 中的路径配置映射到 webpack 中
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack',
      template: 'src/index.html',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve('dist')],
    }),
    // 打包缓存 https://github.com/mzgoddard/hard-source-webpack-plugin
    new HardSourceWebpackPlugin({
      // cacheDirectory是在高速缓存写入。默认情况下，将缓存存储在node_modules下的目录中
      // 'node_modules/.cache/hard-source/[confighash]'
      cacheDirectory: path.join(__dirname, '../../node_modules/.cache/hard-source/[confighash]'),
      // configHash在启动webpack实例时转换webpack配置，
      // 并用于cacheDirectory为不同的webpack配置构建不同的缓存
      configHash: function (webpackConfig) {
        // node-object-hash on npm can be used to build this.
        return require('node-object-hash')({
          sort: false,
        }).hash(webpackConfig);
      },
      // 当加载器、插件、其他构建时脚本或其他动态依赖项发生更改时，
      // hard-source需要替换缓存以确保输出正确。
      // environmentHash被用来确定这一点。如果散列与先前的构建不同，则将使用新的缓存
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock'],
      },
      // An object. 控制来源
      info: {
        // 'none' or 'test'.
        mode: 'none',
        // 'debug', 'log', 'info', 'warn', or 'error'.
        level: 'debug',
      },
      // Clean up large, old caches automatically.
      cachePrune: {
        // Caches younger than `maxAge` are not considered for deletion. They must
        // be at least this (default: 2 days) old in milliseconds.
        maxAge: 2 * 24 * 60 * 60 * 1000,
        // All caches together must be larger than `sizeThreshold` before any
        // caches will be deleted. Together they must be at least this
        // (default: 50 MB) big in bytes.
        sizeThreshold: 50 * 1024 * 1024,
      },
    }),
    new WebpackBar(),
  ],

  // performance: false, // 不输出警告信息

  optimization: {
    usedExports: true,
  },
};
