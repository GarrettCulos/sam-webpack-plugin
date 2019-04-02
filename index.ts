export class CopyPlugin {
    constructor(patterns = [], options = {}) {
      if (!Array.isArray(patterns)) {
        throw new Error('[copy-webpack-plugin] patterns must be an array');
      }
  
      this.patterns = patterns;
      this.options = options;
    }
  
    apply(compiler) {
      const fileDependencies = new Set();
      const contextDependencies = new Set();
      const written = {};
      let context;
  
      if (!this.options.context) {
        ({
          context
        } = compiler.options);
      } else if (!_path.default.isAbsolute(this.options.context)) {
        context = _path.default.join(compiler.options.context, this.options.context);
      } else {
        ({
          context
        } = this.options);
      }
  
      const logger = (0, _webpackLog.default)({
        name: 'copy-webpack-plugin',
        level: this.options.logLevel || 'warn'
      });
      const plugin = {
        name: 'CopyPlugin'
      };
      compiler.hooks.emit.tapAsync(plugin, (compilation, callback) => {
        logger.debug('starting emit');
        const globalRef = {
          logger,
          compilation,
          written,
          fileDependencies,
          contextDependencies,
          context,
          inputFileSystem: compiler.inputFileSystem,
          output: compiler.options.output.path,
          ignore: this.options.ignore || [],
          copyUnmodified: this.options.copyUnmodified,
          concurrency: this.options.concurrency
        };