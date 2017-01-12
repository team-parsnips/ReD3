var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'lib');

var config = {
  entry: APP_DIR + '/index.es.js',
  output: {
    path: BUILD_DIR,
    filename: 'index.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        exclude: '/node_modules/',
        loader : 'babel-loader',
        query : {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};

module.exports = config;