import jwt from 'jsonwebtoken';
import { environment } from '../config/secrets';

export const lambdaDecode = (event: any, context: any) => {
  return new Promise((resolve: Function) => {
    const token = context.headers['x-access-token'];
    if (token) {
      jwt.verify(token, environment.SESSION_SECRET, (err: any, decoded: any) => {
        if (err) {
          return resolve();
        } else {
          return resolve(decoded);
        }
      });
    } else {
      return resolve();
    }
  });
};

export const lambdaCheck = (event: any, context: any) => {
  const token = context.headers['x-access-token'];
  return new Promise((resolve: Function, reject: Function) => {
    if (token) {
      jwt.verify(token, environment.SESSION_SECRET, (err: any, decoded: any) => {
        if (err) {
          return reject({
            status: 401,
            data: err,
            message: 'Failed to authenticate your token',
            source: 'jwt.middleware.service'
          });
        } else {
          return resolve(decoded);
        }
      });
    } else {
      return reject({
        status: 401,
        message: 'Failed to authenticate your token',
        source: 'jwt.middleware.service'
      });
    }
  });
};

export const ping = (event: any, context: any) => {
  return new Promise((resolve, reject) => {
    return resolve('pong');
  });
};
