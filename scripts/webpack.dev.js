const { HotModuleReplacementPlugin } = require('webpack');
const { default: merge } = require('webpack-merge');
const baseConfig = require('./webpack.config');

process.env.NODE_ENV = 'development'

module.exports = merge(baseConfig, {
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  plugins: [
    new HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 2229,
    hot: true,

    proxy: {
      '/rivers': {
        target: 'http://test.api.yiyouliao.com',
        changeOrigin: true
      },
      '/api': {
        target: 'http://39.103.72.108:9100',
        changeOrigin: true
      },
      '/common': {
        target: 'http://test.common.yiyouliao.com',
        changeOrigin: true
      }
    }
  }
});