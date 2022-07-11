/* eslint-disable arrow-body-style */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const chokidar = require('chokidar');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEV_MODE = process.env.NODE_ENV === 'development';

const createHtml = (name, chunks = []) => {
  return new HtmlWebpackPlugin({
    template: `html/${name}.ejs`,
    filename: `${name}.html`,
    minify: false,
    chunks: ['common', ...chunks],
  });
};

/**
 * @type {import('webpack').Configuration}
 */
const webpackConfig = {
  mode: process.env.NODE_ENV,
  context: path.resolve('src'),
  entry: {
    common: ['./app.js'],
  },
  devtool: DEV_MODE ? 'inline-source-map' : false,
  output: {
    path: path.resolve('dist'),
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/[name]-chunk.js',
    assetModuleFilename: '[path][name][ext]',
    publicPath: '/',
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('src/assets'),
      path.resolve('node_modules'),
    ],
    alias: {
      '@': path.resolve('src'),
    },
  },
  /*
    ##     ##  #######  ########  ##     ## ##       ########
    ###   ### ##     ## ##     ## ##     ## ##       ##
    #### #### ##     ## ##     ## ##     ## ##       ##
    ## ### ## ##     ## ##     ## ##     ## ##       ######
    ##     ## ##     ## ##     ## ##     ## ##       ##
    ##     ## ##     ## ##     ## ##     ## ##       ##
    ##     ##  #######  ########   #######  ######## ########
  */
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
      },
      {
        test: /\.(ttf|woff(2)|mp4|eot)$/,
        type: 'asset/resource',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 2, // 2kb
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.ejs$/,
        use: [
          {
            // https://webpack.js.org/loaders/html-loader/
            loader: 'html-loader',
            options: {
              sources: {
                list: [
                  // All default supported tags and attributes
                  '...',
                  {
                    tag: 'img',
                    attribute: 'data-src',
                    type: 'src',
                  },
                  {
                    tag: 'a',
                    attribute: 'data-src',
                    type: 'src',
                  },
                ],
              },
              minimize: false,
              esModule: false,
            },
          },
          {
            // https://github.com/dc7290/template-ejs-loader
            loader: 'template-ejs-loader',
            options: {
              data: {
                BUILD_INFO: new Date().toJSON(),
              },
              // esModule: false,
            },
          },
        ],
        include: path.resolve('src/html'),
      },
      {
        test: /\.(scss|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
              // hmr: DEV_MODE,
            },
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                ident: 'postcss',
                plugins: [require('tailwindcss'), require('autoprefixer')],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
              additionalData: `
                $DEV_MODE: ${DEV_MODE};
                @import '~css/_mixin.scss';
              `,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  /*
    ########  ##       ##     ##  ######   #### ##    ##  ######
    ##     ## ##       ##     ## ##    ##   ##  ###   ## ##    ##
    ##     ## ##       ##     ## ##         ##  ####  ## ##
    ########  ##       ##     ## ##   ####  ##  ## ## ##  ######
    ##        ##       ##     ## ##    ##   ##  ##  ####       ##
    ##        ##       ##     ## ##    ##   ##  ##   ### ##    ##
    ##        ########  #######   ######   #### ##    ##  ######
  */
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
      chunkFilename: 'assets/css/[name]-chunk.css',
    }),
    createHtml('index'),
    createHtml('01-Typography'),
    /* new CopyWebpackPlugin([
      { from: 'assets/copy', to: './', ignore: ['.*'] },
    ]), */
    new webpack.DefinePlugin({
      'process.env': {
        APP_ENV: JSON.stringify(process.env.APP_ENV),
      },
    }),
    ...DEV_MODE
      ? [
        // new FriendlyErrorsPlugin(),
      ]
      : [
        new OptimizeCSSAssetsPlugin({}),
      ],
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 100,
      minChunks: 1,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  /**
   * @type {import('webpack-dev-server').Configuration}
   */
  devServer: {
    // setupMiddlewares(devServer) {
    onBeforeSetupMiddleware(devServer) {
      chokidar.watch('src/html/**/*').on('all', () => {
        devServer.sendMessage(devServer.webSocketServer.clients, 'content-changed');
      });
    },
    historyApiFallback: true,
    port: 3000,
    hot: true,
    host: '0.0.0.0',
  },
  stats: 'minimal',
};

module.exports = webpackConfig;
