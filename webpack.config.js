const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const mode = {
  development: 'development',
  production: 'production',
};

const fileName = (path, ext) => isDev ? `${path}/[name].${ext}` : `${path}/[name].[hash:8].${ext}`;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new TerserWebpackPlugin()
    ]
  }

  return config;
};

const plugins = () => (
  [
    new HTMLWebpackPlugin({
      template: './index.html',
      favicon: './favicon.png',
      inject: true,
      minify: {
        collapseWhitespace: isProd,
        removeComments: isProd,
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: fileName('style', 'css'),
    }),
  ]
);

const cssLoaders = () => ([
  isDev ? "style-loader" : MiniCssExtractPlugin.loader,
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          [
            "postcss-preset-env",
            {
              browsers: 'last 2 versions',
            },
          ],
        ],
      },
    },
  },
  "sass-loader",
]);


module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: mode[process.env.NODE_ENV],
  optimization: optimization(),
  plugins: plugins(),
  entry: {
    app: './index.js',
  },
  output: {
    filename: fileName('js', 'js'),
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: cssLoaders(),
      },
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: 'asset/resource',
      // },
      // {
      //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
      //   type: 'asset/resource',
      // },
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },
  devtool: isDev && 'source-map',
  devServer: {
    port: 3000,
    hot: isDev,
    historyApiFallback: true,
  },
}
