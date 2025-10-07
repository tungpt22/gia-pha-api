export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  database: {
    host: process.env.DB_HOST || '160.22.123.39',
    port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'cpcm',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  upload: {
    destination: process.env.UPLOAD_PATH || './uploads',
    maxSize:
      parseInt(
        process.env.UPLOAD_MAX_SIZE ?? (2 * 1024 * 1024).toString(),
        10,
      ) || 2 * 1024 * 1024, // 2MB
  },
});
