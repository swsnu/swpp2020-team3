const webpack = require('webpack');
module.exports = {
  mode: 'development',
  entry: {
    app: '',
  },
  output: {
    path: '',
    filename: '',
    publicPath: '',
  },
  module: {

  },
  options: {
    presets: [ '@babel/preset-env', '@babel/preset-react' ],
    plugins: [
      "@babel/plugin-proposal-class-properties"
    ]
  } 
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
};
