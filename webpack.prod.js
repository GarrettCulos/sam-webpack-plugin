const merge = require('webpack-merge');
const path = require('path');
const { baseConfig, baseDeployment } = require('./webpack.base');
const devConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'lib', 'prod')
  }
};
module.exports = [merge(baseConfig, { ...devConfig })];
