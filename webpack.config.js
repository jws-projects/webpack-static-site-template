require('dotenv').config();

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const enabledSourceMap = process.env.NODE_ENV !== 'production';

const IMAGE_URL = process.env.IMAGE_URL;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const target = IS_DEVELOPMENT ? 'web' : 'browserslist';

const dirSrc = path.join(__dirname, 'src');
const dirJs = path.join(__dirname, 'src/js');
const dirShared = path.join(__dirname, 'src/shared');
const dirStyles = path.join(__dirname, 'src/styles');
const dirViews = path.join(__dirname, 'src/views');
const dirImages = path.join(__dirname, 'src/images');
const dirPublic = path.join(__dirname, 'public');
const dirPublicAssets = path.join(__dirname, 'public/assets');
const dirPublicAssetsImages = path.join(__dirname, 'public/assets/images');
const dirPublicAssetsCSS = path.join(__dirname, 'public/assets/css');

const dirNode = path.join(__dirname, 'node_modules');

const getFileName = function (path) {
  return path.replace(/\.[^/.]+$/, '');
};

const templates = [];
glob
  .sync('**/*.pug', {
    ignore: '**/_*.pug',
    cwd: dirViews,
  })
  .map(function (file) {
    templates.push(
      new HtmlWebpackPlugin({
        template: path.resolve(dirViews, file),
        filename: getFileName(file) + '.html',
        data: IMAGE_URL,
      })
    );
  });

module.exports = {
  mode: process.env.NODE_ENV,

  entry: [path.join(dirJs, 'index.js'), path.join(dirStyles, 'main.scss')],

  target: target,

  devtool: IS_DEVELOPMENT ? 'source-map' : false,

  devServer: {
    contentBase: '/public/',
    writeToDisk: true,
  },

  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: 'auto',
  },

  resolve: {
    modules: [dirJs, dirViews, dirShared, dirStyles, dirNode],
  },

  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
    }),

    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: dirShared, to: dirPublic, noErrorOnMissing: true },
        { from: dirImages, to: dirPublicAssetsImages, noErrorOnMissing: true },
        // for WordPressTheme
        // { from: dirPublicAssets, to: path.resolve(__dirname, '../assets') },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
      chunkFilename: 'assets/css/[id].css',
    }),

    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)/,
          options: {
            quality: 75,
          },
        },
      ],
      overrideExtension: true,
      detailedLogs: false,
      silent: false,
      strict: true,
    }),

    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          [
            'gifsicle',
            {
              interlaced: false,
              optimizationLevel: 1,
              colors: 256,
            },
          ],
          [
            'mozjpeg',
            {
              quality: 95,
            },
          ],
          ['pngquant', { quality: [0.9, 0.95] }],
        ],
      },
    }),

    ...templates,
    new HtmlWebpackPugPlugin(),

    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              self: true,
            },
          },
          {
            loader: 'webpack-ssi-include-loader',
            options: {
              localPath: path.join(__dirname, '/public/'),
              location: '/',
            },
          },
        ],
      },

      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: !!IS_DEVELOPMENT,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: '$IMAGE_URL: "' + IMAGE_URL + '";',
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
              },
              sourceMap: enabledSourceMap,
            },
          },
          {
            loader: 'import-glob-loader',
          },
        ],
      },

      {
        test: /\.(jpe?g|png|gif|svg||webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },

      {
        test: /\.(glsl|frag|vert)$/,
        use: [
          {
            loader: 'raw-loader',
            options: {
              exclude: /node_modules/,
            },
          },
          {
            loader: 'glslify-loader',
            options: {
              exclude: /node_modules/,
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
