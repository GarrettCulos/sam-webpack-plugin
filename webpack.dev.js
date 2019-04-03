const merge = require('webpack-merge');
const { baseConfig } = require('./webpack.base');
const devConfig = {};
module.exports = [merge(baseConfig, { ...devConfig })];
