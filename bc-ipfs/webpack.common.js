/* jshint esversion: 6 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const appConfig = require(`./config/${process.env.NODE_ENV === 'production' ? 'production' : 'default'}.json`);

module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      { test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf)$/, type: 'asset/resource' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ CONFIG: JSON.stringify(appConfig) }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      inject: 'body',
    }),
  ],
};
