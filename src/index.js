const fs = require('fs');
const path = require('path');
const { createAction, mkdirAction, rimrafAction, copyAction } = require('./actions');
const pluginName = 'LambdaWebpackPlugin';

class LambdaWebpackPlugin {
  /**
   * @param {Object} options
   * @param {String} options.baseTemplate [required]
   * @param {Array} options.layers
   * @param {String} options.output
   * @param {Boolean} options.verbose
   */
  constructor({ output, verbose, layers, baseTemplate }) {
    /**
     * define regex's
     */
    this.declarationRegex = /(?<=@WebpackLambda\()([^\)]+)(?=(\)))/g;
    this.filenameRegex = /\w+(?:\.\w+)*$/;

    /**
     * deployment folder that holds all deployment functions
     */
    if (output && typeof output !== 'string') {
      throw `[${pluginName}]: options.output must be of type String`;
    }
    this.deploymentFolder = output || './lambda-sam-deploy';

    /**
     * verbose setting must be a boolean if set
     */
    if (verbose && typeof verbose !== 'boolean') {
      throw `[${pluginName}]: options.output must be a boolean`;
    }
    this.options = { verbose: verbose || false };

    /**
     * layers setting must be an array if set
     */
    if (Boolean(layers) && typeof layers !== 'object') {
      throw `[${pluginName}]: options.layers must be of type object`;
    }
    this.layers = layers;

    /**
     * baseTemplate must be of type string
     */
    if (!baseTemplate || typeof baseTemplate !== 'string') {
      throw `[${pluginName}]: options.baseTemplate must be of defined and of type String`;
    }
    this.baseTemplate = JSON.parse(fs.readFileSync(baseTemplate, 'utf8'));
  }

  /**
   * Parses the content of the lambda decorator
   * @param {String} content
   * @returns {Object}
   */
  parseLambdaDeclaration(content) {
    // TODO handle error when parsing @WebpackLambda decorator;
    const match = content.match(this.declarationRegex);
    if (!match) return;
    return JSON.parse(match[0]);
  }

  /**
   * Compute all external dependencies and sub deps
   * @param {Array} dependencies
   * @returns {String[]}
   */
  logDependencies(dependencies) {
    let deps = [];
    Array.isArray(dependencies) &&
      dependencies.forEach(dependency => {
        if (dependency.request) {
          deps.push({ request: dependency.request });
          // if (dependency.request === 'mysql') {
          //   dependency.module.reasons.forEach(reason => {
          //     console.log(reason.module);
          //   });
          // }
        }
        // console.log(dependency.module && dependency.module.issuer && dependency.module.issuer.dependencies);
        if (dependency.module && dependency.module && dependency.module.dependencies) {
          deps.push(...this.logDependencies(dependency.module.dependencies));
        }
      });
    return deps;
  }

  apply(compiler) {
    const plugin = {
      name: pluginName
    };

    /**
     * globally available data
     */
    const globals = {
      entries: {},
      outputPath: compiler.options.output.path,
      deployFolder: path.join(compiler.options.context, this.deploymentFolder)
    };

    /**
     * All entry files will be checked for lambda declaration. If decorator is present, add config, context, path, and filename to globals.entries
     * @param {*} context
     * @param {*} entries
     */
    const registerEntryLambdaFunctions = (context, entries) => {
      // register entries with lambda function parser
      globals.entries = Object.keys(entries).reduce((acc, entry) => {
        const content = fs.readFileSync(entries[entry], 'utf8');
        const config = this.parseLambdaDeclaration(content);
        if (config) {
          return {
            ...acc,
            [entry]: {
              key: entry,
              context,
              path: entries[entry],
              files: [],
              filename: path.basename(entry, path.extname(entry)),
              config,
              dependencies: undefined
            }
          };
        }
        return acc;
      }, {});
    };

    /**
     * For each chunk, if its been flagged as having a lambda decorator (is within globals.entries), add files, and dependencies to the entry
     * @param {*} compilation
     * @param {*} callback
     */
    const addConfigDependencies = (compilation, callback) => {
      compilation.chunks.forEach(chunk => {
        if (globals.entries[chunk.name]) {
          globals.entries[chunk.name].files = chunk.files;
          globals.entries[chunk.name].dependencies = this.logDependencies(chunk.entryModule.dependencies);
        }
      });
      callback();
    };

    /**
     * Once webpack is done (so files have been written) create sam application structure
     *  - create folders for each lambda function (deployment folder)
     *  - create sam template from baseTemplate and parsed configs
     * @param {*} compilation
     * @param {*} callback
     */
    const createLambdaDeployments = (compilation, callback) => {
      const entries = Object.keys(globals.entries).map(key => globals.entries[key]);
      const commands = [];

      /**
       * create deployment folder
       */
      commands.push(rimrafAction({ source: globals.deployFolder }, this.options));
      commands.push(mkdirAction({ source: globals.deployFolder }, this.options));

      entries.forEach(entry => {
        /**
         * create deployment folder (half hash and name)
         */
        const entryCodeUriPath = entry.filename;
        const entryPath = path.join(globals.deployFolder, entryCodeUriPath);
        commands.push(mkdirAction({ source: entryPath }, this.options));

        /**
         * move lambda function
         */
        entry.files.forEach(file => {
          // when we can compute the function name, add in standard index.js handler
          // path.join(entryPath, 'index.js')
          commands.push(
            copyAction({ source: path.join(globals.outputPath, file), destination: entryPath }, this.options)
          );
        });

        /**
         * copy alias references that are external into node_modules folder
         */
        commands.push(mkdirAction({ source: path.join(entryPath, 'node_modules') }, this.options));

        /**
         * copy dependencies into node_modules folder ( or ??? create requirements.txt)
         */
        entry.dependencies.forEach(dependency => {
          let source = null;
          if (this.layers[dependency.request]) {
            source = this.layers[dependency.request];
          } else {
            source = path.join(entry.context, 'node_modules', dependency.request);
          }
          commands.push(
            copyAction({ source, destination: path.join(entryPath, 'node_modules', dependency.request) }, this.options)
          );
        });

        /**
         * merge entry with base cf template
         */
        this.baseTemplate = {
          ...this.baseTemplate,
          Resources: {
            ...this.baseTemplate.Resources,
            [`Function_${entry.filename}`]: {
              ...entry.config,
              ['Type']: 'AWS::ApiGateway::Method',
              ['Properties']: {
                ...entry.config.Properties,
                ...entry.config.properties,
                ['CodeUri']: `./${entryCodeUriPath}`
              }
            }
          }
        };
      });

      commands.push(
        createAction(
          { source: path.join(globals.deployFolder, 'template.json'), content: JSON.stringify(this.baseTemplate) },
          this.options
        )
      );

      if (commands.length) {
        commands.reduce((previous, fn) => {
          return previous.then(retVal => fn(retVal)).catch(err => console.log(err));
        }, Promise.resolve());
      }

      callback();
    };

    compiler.hooks.entryOption.tap(plugin, registerEntryLambdaFunctions);
    compiler.hooks.emit.tapAsync(plugin, addConfigDependencies);
    compiler.hooks.done.tapAsync(plugin, createLambdaDeployments);
  }
}

module.exports = LambdaWebpackPlugin;
