var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: {
    collectionLinks: './src/main/webapp/collectionLinks/index.js',
    search: './src/main/webapp/search/index.js',
    pages: './src/main/webapp/pages/index.js',
  },
  output: {
    path: path.join(__dirname, 'grails-app/assets/javascripts'),
    publicPath: 'http://localhost:3000/assets/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src/main/js')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url?limit=10000&prefix=assets/!img'
      }
    ]
  }
};

