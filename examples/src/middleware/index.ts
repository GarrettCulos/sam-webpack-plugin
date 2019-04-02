import * as jwtLambda from './jwt-lambda';
export const jwt = {
  ping: jwtLambda.ping,
  decode: jwtLambda.lambdaDecode,
  check: jwtLambda.lambdaCheck
};
