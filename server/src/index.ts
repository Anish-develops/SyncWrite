/// <reference path="./types/express.d.ts" />
import { createServer } from './server';
import { ENV } from './config/env';
import { runMigrations } from './database/migrate';

async function start() {
  try {
    console.log(' SyncWrite server starting...');

    // Run database migrations
    runMigrations();
    console.log(' Database schema initialized');

    const { httpServer } = createServer();

    httpServer.listen(ENV.PORT, '0.0.0.0', () => {
      console.log(` SyncWrite server listening on 0.0.0.0:${ENV.PORT}`);
      console.log(` REST API: http://localhost:${ENV.PORT}/api`);
      console.log(` Client URL: ${ENV.CLIENT_URL}`);
    });
  } catch (error) {
    console.error(' Failed to start SyncWrite server:', error);
    process.exit(1);
  }
}

start();
