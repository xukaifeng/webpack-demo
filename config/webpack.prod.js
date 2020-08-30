const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const prodConfig = {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash:8].bundle.js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
  },

  devtool: 'cheap-eval-source-map',

  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader', // 添加css前缀
        ],
      },
    ],
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        // include: ['src/'],
        exclude: /\.min\.js$/,
        parallel: true,
        cache: true,
        // sourceMap: true,
      }),
    ],
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

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
    new OptimizeCSSAssetsPlugin({
      // ExtractTextPlugin 或 MiniCssExtractPlugin导出的文件名
      assetNameRegExp: /\.css$/g,
      // 用于优化/最小化CSS的CSS处理器，默认为cssnano
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
          },
        ],
      },
      // 控制插件是否可以将消息打印到控制台，默认为 true
      canPrint: true,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
