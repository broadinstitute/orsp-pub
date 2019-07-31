onst path = require('path');

module.exports = {
  node: {
      fs: "empty"
  },
  entry: {
    adminOnly: './src/main/webapp/adminOnly/AdminOnly.js',
    collectionLinks: './src/main/webapp/collectionLinks/index.js',
    consentGroup: './src/main/webapp/consentGroup/index.js',
    dataUseLetter: './src/main/webapp/dataUseLetter/index.js',
    footer: './src/main/webapp/components/footer.js',
    infoLink: './src/main/webapp/infoLink/index.js',
    linkWizard: './src/main/webapp/linkWizard/index.js',
    mainIndex: './src/main/webapp/main/main_index.js',
    search: './src/main/webapp/search/index.js'
  },
  output: {
    path: path.join(__dirname, 'grails-app/assets/javascripts/build'),
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

