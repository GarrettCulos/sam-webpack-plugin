import fs from 'fs';

/**
 * Execute create action
 *
 * @param {Object} command - Command data for given action
 * @return {Function|null} - Function that returns a promise or null
 */
function createAction(command, options) {
  const { verbose } = options;

  if (!command.source || !command.content) {
    verbose &&
      console.log(
        '  - Lambda Webpack Plugin: Warning - creat parameter has to be formated as follows: { source: <string>, content: <string> }'
      );
    return null;
  }

  return () =>
    new Promise((resolve, reject) => {
      verbose && console.log(`  - Lambda Webpack Plugin: Start creating source: ${command.source}`);
      fs.writeFile(command.source, command.content, err => {
        if (err) {
          verbose && console.log(`  - Lambda Webpack Plugin: Failed to create source: ${command.source}`);
          return reject();
        }
        verbose && console.log(`  - Lambda Webpack Plugin: Finished to create source: ${command.source}`);
        return resolve();
      });
    });
}

export { createAction };
