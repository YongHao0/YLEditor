const path = require('path');
const rootPath = path.join(__dirname, '..');

const { default: merge } = require('webpack-merge');
const baseConfig = require('./webpack.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.join(rootPath, 'dist'),
    filename: '[name].[contenthash:8].js'
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  }
})