const merge = require('webpack-merge');
const path = require('path');
const { middlewareWebpackConfig, lambdaFunctions, databaseWebpackConfig } = require('./webpack.base');
const devConfig = {
  resolve: {
    alias: {
      'environment/environment': path.resolve(__dirname, 'src/config/environment')
    }
  }
};
module.exports = [
  merge(middlewareWebpackConfig, { ...devConfig }),
  merge(databaseWebpackConfig, { ...devConfig }),
  merge(lambdaFunctions, { ...devConfig })
];
