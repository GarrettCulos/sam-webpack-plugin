import fs from 'fs';
import mv from 'mv';

/**
 * Execute move action
 *
 * @param {Object} command - Command data for given action
 * @return {Function|null} - Function that returns a promise or null
 */
function moveAction(command: any, options: any) {
  const { verbose } = options;

  if (!command.source || !command.destination) {
    if (verbose) {
      console.log(
        '  - Lambda Webpack Plugin: Warning - move parameter has to be formated as follows: { source: <string>, destination: <string> }'
      );
    }
    return;
  }

  if (fs.existsSync(command.source)) {
    return () =>
      new Promise((resolve, reject) => {
        if (verbose) {
          console.log(
            `  - Lambda Webpack Plugin: Start move source: ${command.source} to destination: ${command.destination}`
          );
        }

        mv(command.source, command.destination, { mkdirp: false }, err => {
          if (err) {
            if (verbose) {
              console.log('  - Lambda Webpack Plugin: Error - move failed', err);
            }
            reject(err);
          }

          if (verbose) {
            console.log(
              `  - Lambda Webpack Plugin: Finished move source: ${command.source} to destination: ${
                command.destination
              }`
            );
          }

          resolve();
        });
      });
  } else {
    process.emitWarning(`  - Lambda Webpack Plugin: Could not move ${command.source}: path does not exist`);
    return;
  }
}

export { moveAction };
