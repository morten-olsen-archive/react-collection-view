const path = require('path');

module.exports = {
  context: __dirname,
  entry: path.join(__dirname, 'entry.jsx'),
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../docs'),
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['es2015', 'stage-1', 'react'],
      },
    }],
  },
  devServer: {
    contentBase: __dirname,
  },
};
