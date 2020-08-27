const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { plugins } = require('../postcss.config');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
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
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
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
        test: /\.(png|jpg|gif|jpeg|ico|cur)$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[name]_[contenthash:8].[ext]',
            outputPath: 'image/',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.less',
      '.scss',
      '.css',
      '.json',
    ],
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
    new CleanWebpackPlugin(),
    // 打包缓存 https://github.com/mzgoddard/hard-source-webpack-plugin
    new HardSourceWebpackPlugin({
      // cacheDirectory是在高速缓存写入。默认情况下，将缓存存储在node_modules下的目录中
      // 'node_modules/.cache/hard-source/[confighash]'
      cacheDirectory: path.join(
        __dirname,
        '../../node_modules/.cache/hard-source/[confighash]'
      ),
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
  ],

  optimization: {
    splitChunks: {
      // chunks: 'async', // 仅对异步的代码进行同步分割
      // 默认为 async （只针对异步块进行拆分），值为 all/initial/async/function(chunk) ,值为 function 时第一个参数为遍历所有入口 chunk 时的 chunk 模块，chunk._modules 为 chunk 所有依赖的模块，
      // 通过 chunk 的名字和所有依赖模块的 resource 可以自由配置,会抽取所有满足条件 chunk 的公有模块，以及模块的所有依赖模块，包括 css
      chunks: 'all',

      // minRemainingSize: 0,
      // webpack5 中引入，限制拆分后剩余的块的最小大小，避免大小为零的模块
      // 仅仅对剩余的最后一个块有效
      // 在“开发”模式下默认为0
      // 在其他情况下，默认值为 minSize 的值
      // 因此除极少数需要深度控制的情况外，无需手动指定它

      // 旨在与HTTP/2和长期缓存一起使用
      // 它增加了请求数量以实现更好的缓存
      // 它还可以用于减小文件大小，以加快重建速度。
      minSize: 30000, // 表示在压缩前的最小模块大小,默认值是30kb

      minChunks: 1, // 表示被引用次数，默认为1； 如lodash需要至少引用 {minChunks} 次才分割
      maxAsyncRequests: 6, // 按需加载时的最大并行请求数
      maxInitialRequests: 4, // 入口的最大并行请求数
      automaticNameDelimiter: '~', // 名称分隔符，默认是~
      name: true,
      cacheGroups: {
        // 设置缓存组用来抽取满足不同规则的 chunk ,下面以生成 vendors 为例
        vendors: {
          name: 'vendors', // 抽取的 chunk 的名字
          test: /[\\/]node_modules[\\/]/, // 可以为字符串，正则表达式，函数，以 module 为维度进行抽取，只要是满足条件的 module 都会被抽取到该 common 的 chunk 中，为函数时第一个参数是遍历到的每一个模块，第二个参数是每一个引用到该模块的 chunks 数组。
          priority: -10, // 优先级，一个 chunk 很可能满足多个缓存组，会被抽取到优先级高的缓存组中
          minChunks: 2, // 最少被几个 chunk 引用
          reuseExistingChunk: true, // 如果该 chunk 中引用了已经被抽取的 chunk，直接引用该 chunk，不会重复打包代码
          // enforce: true, // 如果 cacheGroup 中没有设置 minSize ，则据此判断是否使用上层的 minSize ，true：则使用0，false：使用上层 minSize
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
