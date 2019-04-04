const path = require('path');
const nodeExternals = require('webpack-node-externals');
const tsRule = {
  test: /\.ts?$/,
  use: [
    {
      loader: 'babel-loader'
    }
  ],
  exclude: [/node_modules/]
};

const baseConfig = {
  mode: 'none',
  entry: './src/index.ts',
  externals: [nodeExternals()],
  target: 'node',
  module: {
    rules: [tsRule]
  },
  resolve: {
    extensions: ['.ts']
  },
  output: {
    library: 'Lambda Webpack Plugin',
    libraryTarget: 'umd',
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist', 'dev')
  }
};

module.exports = {
  baseConfig
};
