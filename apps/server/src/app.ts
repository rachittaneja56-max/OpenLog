import path from 'node:path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import { requestLogger } from './middleware/request-logger';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { apiNotFoundHandler, frontendNotFoundHandler } from './middleware/not-found';
import { apiRouter } from './routes/api.routes';

export const app = express();

if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        baseUri: ["'self'"],
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));
app.use(requestLogger);

if (env.NODE_ENV === 'development') {
  const localOrigins = [env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(
    (origin): origin is string => typeof origin === 'string'
  );

  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (!origin || localOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
    })
  );
}

app.use('/api', apiRouter);
app.use('/api', apiNotFoundHandler);

if (env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../web/dist');
  const indexFile = path.join(frontendDist, 'index.html');

  app.use(express.static(frontendDist));
  app.get('*', (request: Request, response: Response, next: NextFunction) => {
    if (!request.accepts('html')) {
      next();
      return;
    }

    response.sendFile(indexFile, (error) => {
      if (error) {
        next(error);
      }
    });
  });
}

app.use(frontendNotFoundHandler);
app.use(errorHandler);
