const path = require('path');

module.exports = {
  node: {
      fs: "empty"
  },
  entry: {
    collectionLinks: './src/main/webapp/collectionLinks/index.js',
    search: './src/main/webapp/search/index.js',
    pages: './src/main/webapp/pages/index.js',
    consentGroup: './src/main/webapp/consentGroup/index.js'

  },
  output: {
    path: path.join(__dirname, 'grails-app/assets/javascripts'),
    publicPath: '/assets/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src/main/webapp'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["react", ["es2015", {"modules": false}]],
            plugins: ["transform-class-properties"]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: {
          loader: 'url-loader?limit=10000&prefix=assets/!img'
        }
      }
    ]
  }
};

