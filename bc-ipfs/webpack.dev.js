/* jshint esversion: 6 */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './public',
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'auto',
    historyApiFallback: true,
  },
});
