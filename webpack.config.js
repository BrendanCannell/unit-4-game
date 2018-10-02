const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules']
  },
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      { test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(jpeg|jpg|png|webp)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
}