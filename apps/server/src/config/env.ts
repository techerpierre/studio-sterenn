import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: parseInt(process.env.PORT ?? '3000'),
  JWT_SECRET_KEY:
    process.env.JWT_SECRET_KEY ?? 'my-secret-key-change-in-production',
  REFRESH_TOKEN_SECRET_KEY:
    process.env.REFRESH_TOKEN_SECRET_KEY ??
    'my-secret-key-change-in-production-2',
  DATABASE_URL:
    process.env.DATABASE_URL ??
    'postgres://user:password@localhost:5432/sterenn?schema=public',
  REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT ?? '6379'),
  S3_ENDPOINT: process.env.S3_ENDPOINT ?? 'http://localhost:9000',
  S3_REGION: process.env.S3_REGION ?? 'us-east-1',
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID ?? 'minio',
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY ?? 'miniopassword',
} as const;
