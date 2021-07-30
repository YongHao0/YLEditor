const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const rootPath = path.join(__dirname, '..');

module.exports = {
  entry: path.join(rootPath, 'src', 'index.ts'),
  resolve: {
    extensions: ['.js', '.ts', '.vue'],
    alias: {
      '@/types': path.join(rootPath, 'src', 'types'),
      '@': path.join(rootPath, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /(\.(js|ts))$/,
        use: ['babel-loader']
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        }]
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.(png|gif|jpg|jpeg|bmp|svg|gif|woff|woff2|ttf|eot)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 5000
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(rootPath, 'public', 'index.html'),
      favicon: path.join(rootPath, 'public', 'icons', 'logo.png')
    }),
    new VueLoaderPlugin()
  ]
}