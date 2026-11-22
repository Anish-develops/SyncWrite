import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { ENV } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): express.Application {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allow inline styles and external scripts for Monaco
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (same-origin, curl, server-to-server) or any host in production
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    })
  );

  // Request logger
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Body parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.use('/api', routes);

  // Serve client static files in production
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexHtml = path.join(clientDist, 'index.html');
    res.sendFile(indexHtml, (err) => {
      if (err) {
        res.status(200).send('SyncWrite Server Running. Client not yet built.');
      }
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
