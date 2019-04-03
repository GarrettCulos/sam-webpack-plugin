const glob = require('glob');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const SamWebpackPlugin = require('../dist/prod');
const getEntries = pattern => {
  console.log(pattern, glob.sync(pattern));
  return glob.sync(pattern).reduce((acc, file) => {
    acc[file] = path.join(__dirname, '..', file);
    return acc;
  }, {});
};
const baseDeployment = 'dist';
const tsRule = {
  test: /\.ts?$/,
  use: [
    {
      loader: 'babel-loader'
    }
  ],
  exclude: [/node_modules/]
};
const MIDDLEWARE = 'middleware';
const DATABASE = 'database';
const localExternals = [MIDDLEWARE, DATABASE];

const aliases = {
  [MIDDLEWARE]: path.resolve(__dirname, 'src/middleware/'),
  [DATABASE]: path.resolve(__dirname, 'src/database/')
};

const middlewareWebpackConfig = {
  mode: 'none',
  entry: {
    library: path.resolve(__dirname, './src/middleware/index.ts')
  },
  externals: [nodeExternals(), ...localExternals],
  target: 'node',
  module: {
    rules: [tsRule]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    library: 'middleware',
    filename: 'index.js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, `${baseDeployment}/${MIDDLEWARE}`)
  }
};

const databaseWebpackConfig = {
  mode: 'none',
  entry: {
    lambda: path.resolve(__dirname, './src/database/index.ts')
  },
  externals: [nodeExternals(), ...localExternals],
  target: 'node',
  module: {
    rules: [tsRule]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, `${baseDeployment}/${DATABASE}`),
    libraryTarget: 'commonjs'
  }
};

const lambdaFunctions = {
  mode: 'none',
  entry: getEntries('./examples/src/lambda/**/*-lambda.ts'),
  externals: [nodeExternals(), ...localExternals],
  target: 'node',
  module: {
    rules: [tsRule]
  },
  resolve: {
    extensions: ['.ts'],
    alias: aliases
  },
  output: {
    library: 'lambda Functions api',
    libraryTarget: 'umd',
    filename: chunkData => `${chunkData.chunk.name.replace('.ts', '')}.js`,
    path: path.resolve(__dirname, `${baseDeployment}`)
  },
  plugins: [
    new SamWebpackPlugin({
      layers: {
        [DATABASE]: databaseWebpackConfig.output.path,
        [MIDDLEWARE]: middlewareWebpackConfig.output.path
      },
      output: './examples/lambda-sam-deploy',
      baseTemplate: path.resolve(__dirname, './template.json')
    })
  ]
};

module.exports = {
  MIDDLEWARE,
  DATABASE,
  baseDeployment,
  databaseWebpackConfig,
  middlewareWebpackConfig,
  lambdaFunctions
};
