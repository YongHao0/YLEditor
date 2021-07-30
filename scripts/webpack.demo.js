const { HotModuleReplacementPlugin } = require('webpack');
const { default: merge } = require('webpack-merge');
const baseConfig = require('./webpack.config');
const path = require('path');

const rootPath = path.join(__dirname, '..');

process.env.NODE_ENV = 'development'

module.exports = merge(baseConfig, {
  entry: path.join(rootPath, 'src', 'demo', 'main.ts'),
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  plugins: [
    new HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 2229,
    hot: true,
  }
});