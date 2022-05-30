require('dotenv').config();

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const { ESBuildMinifyPlugin } = require('esbuild-loader');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');

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

const getFileName = (path) => path.replace(/\.[^/.]+$/, '');

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
      }),
    );
  });

module.exports = {
  mode: process.env.NODE_ENV,

  entry: [path.join(dirJs, 'index.js'), path.join(dirStyles, 'main.scss')],

  target,

  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },

  devtool: IS_DEVELOPMENT ? 'source-map' : false,

  devServer: {
    open: true,
    hot: true,
    static: {
      watch: true,
      directory: path.resolve(__dirname, 'public'),
    },
    devMiddleware: {
      writeToDisk: false,
    },
  },

  watchOptions: {
    ignored: /node_modules/,
  },

  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: 'auto',
    clean: !IS_DEVELOPMENT,
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

    new HtmlWebpackPugPlugin({
      adjustIndent: true,
    }),

    ...templates,

    // new ImageminWebpWebpackPlugin({
    //   config: [
    //     {
    //       test: /\.(jpe?g|png)/,
    //       options: {
    //         quality: 75,
    //       },
    //     },
    //   ],
    //   overrideExtension: true,
    //   detailedLogs: false,
    //   silent: false,
    //   strict: true,
    // }),

    // new ImageMinimizerPlugin({
    //   minimizerOptions: {
    //     plugins: [
    //       [
    //         'gifsicle',
    //         {
    //           interlaced: false,
    //           optimizationLevel: 1,
    //           colors: 256,
    //         },
    //       ],
    //       [
    //         'mozjpeg',
    //         {
    //           quality: 95,
    //         },
    //       ],
    //       ['pngquant', { quality: [0.9, 0.95] }],
    //     ],
    //   },
    // }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'js-loader-pool',
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              target: 'es2015',
              sourcemap: IS_DEVELOPMENT,
            },
          },
        ],
      },

      {
        test: /\.pug$/,
        include: path.resolve(__dirname, 'src/views'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'pug-loader-pool',
            },
          },
          {
            loader: 'pug3-loader',
            options: {
              self: true,
            },
          },
          // {
          //   loader: 'webpack-ssi-include-loader',
          //   options: {
          //     localPath: path.join(__dirname, '/public/'),
          //     location: '/',
          //   },
          // },
        ],
      },

      {
        test: [/\.css$/, /\.scss$/, /\.sass$/],
        include: path.resolve(__dirname, 'src/styles'),
        exclude: /node_modules/,
        use: [
          // {
          //   loader: 'thread-loader',
          //   options: {
          //     workers: require('os').cpus().length - 1,
          //     name: 'scss-loader-pool',
          //   },
          // },
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   publicPath: '',
            // },
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: IS_DEVELOPMENT,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer', { grid: true }]],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: '$IMAGE_URL: "' + IMAGE_URL + '";',
              implementation: require('sass'),
              sassOptions: {
                charset: true,
                outputStyle: 'compressed',
              },
              sourceMap: IS_DEVELOPMENT,
            },
          },
          {
            loader: 'import-glob-loader',
          },
        ],
      },

      {
        test: /\.(jpe?g|png|gif|svg||webp)$/,
        include: path.resolve(__dirname, 'src/images'),
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'img-loader-pool',
            },
          },
        ],
      },

      {
        test: /\.(ttf|eot|woff|woff2)$/,
        include: path.resolve(__dirname, 'src/shared/assets/fonts'),
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext]',
        },
      },

      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        include: path.resolve(__dirname, 'src/shared/images/'),
        type: 'asset/source',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
    ],
  },

  optimization: {
    minimize: !IS_DEVELOPMENT,
    minimizer: [
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
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
        },
      }),
      new ESBuildMinifyPlugin({
        target: 'es2015',
      }),
      new HtmlMinimizerPlugin({
        minimizerOptions: {
          caseSensitive: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          preserveLineBreaks: true,
          removeComments: true,
          sortAttributes: true,
        },
      }),
    ],
  },
};
