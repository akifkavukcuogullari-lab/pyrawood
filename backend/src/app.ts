import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'http://localhost:3000', 'https://pyrawood.vercel.app']
      : ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3001'],
    credentials: true,
  })
);

// Stripe webhook route needs raw body — must be mounted BEFORE express.json()
// The actual webhook handler will be registered in routes, but we set up
// the raw body parser on the specific path here.
app.use(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' })
);

// JSON body parser for all other routes
app.use(express.json());

// URL-encoded body parser
app.use(express.urlencoded({ extended: true }));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
