export const constants = {
    SESSION_SECRET: 'super-duper-secret',
  
    // Server Port
    PORT: '3000',
  
    // NODE_ENV
    NODE_ENV: 'production',
  
    // Services Config
    s3UploadAssessKey: '<key>',
    s3UploadAccessKeySecret: '<key-secret>',
  
    // Database Config
    DB_USERNAME: 'root',
    DB_PASSWORD: '',
    DB_HOST: 'docker.for.mac.localhost', // sam access to local database (through docker)
    DB_DATABASE: 'example-database',
    DB_CONNECTION_LIMIT: '1',
    DB_DIALECT: 'mysql',
    DB_TIMEZONE: 'America/Los_Angeles',
    DB_POOL_MAX: '1',
    DB_POOL_MIN: '0',
    DB_POOL_IDLE: '1',
    GOOGLE_CLIENT_ID: 'google-client-id',
  
    // Redis Config
    REDIS_PORT: '6379',
    REDIS_HOST: 'docker.for.mac.localhost' // sam access to localhost (through docker)
  };
  