import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'syncwrite_access_jwt_secret_dev_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'syncwrite_refresh_jwt_secret_dev_2026',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '1h',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  DATA_DIR: path.resolve(process.env.DATA_DIR || path.join(__dirname, '../../../data')),
  PROJECTS_DIR: path.resolve(process.env.PROJECTS_DIR || path.join(__dirname, '../../../projects')),
};
