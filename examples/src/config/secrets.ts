import { constants } from 'environment/environment';

const ENVIRONMENT = constants.NODE_ENV;
const SESSION_SECRET = constants.SESSION_SECRET;
const PORT = constants.PORT;
const GOOGLE_CLIENT_ID = constants.GOOGLE_CLIENT_ID;
const production = ENVIRONMENT === 'production';

const host = constants.DB_HOST;
const user = constants.DB_USERNAME;
const password = constants.DB_PASSWORD;
const database = constants.DB_DATABASE;
const connectionLimit = constants.DB_CONNECTION_LIMIT;
const dialect = constants.DB_DIALECT;
const timezone = constants.DB_TIMEZONE;
//const logging = production ? false : (s: any) => recorder.activeRecording && recorder.logQuery(s);
const logging = false;
const pool = {
  max: parseInt(constants.DB_POOL_MAX),
  min: parseInt(constants.DB_POOL_MIN),
  idle: parseInt(constants.DB_POOL_IDLE)
};
const db = {
  connectionLimit: parseInt(connectionLimit),
  username: user,
  password,
  database,
  host,
  dialect,
  options: {
    host,
    dialect,
    dialectOptions: production
      ? {
          ssl: 'Amazon RDS'
        }
      : {
          ssl: false
        },
    timezone,
    logging,
    pool
  }
};

const redis = {
  port: parseInt(constants.REDIS_PORT),
  host: constants.REDIS_HOST
};

if (!SESSION_SECRET) {
  console.log('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}
export const environment = {
  ENVIRONMENT,
  SESSION_SECRET,
  GOOGLE_CLIENT_ID,
  PORT,
  production,
  db,
  redis,
}
