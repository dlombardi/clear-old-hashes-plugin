var path = require('path');

var ClearOldHashesPlugin = require('../index.js');

module.exports = {
  entry: {
    bundle: './test/dummy/entry.js',
    vendor: './test/dummy/vendor.js'
  },
  output: {
    path: path.join(process.cwd(), './tmp'),
    filename: 'bundle.[id].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new ClearOldHashesPlugin({delimiter: '.'})
  ]
}
