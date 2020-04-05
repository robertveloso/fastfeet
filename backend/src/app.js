import './bootstrap';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { resolve } from 'path';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

import redisConfig from './config/redis';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(helmet());
    this.server.use(cors()); // cors({ origin:'http://my-frontend-url.com' })

    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    if (process.env.NODE_ENV !== 'development')
      this.server.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient({
              host: redisConfig.host,
              port: redisConfig.port,
            }),
          }),
          windowMs: 1000 * 60 * 15,
          max: 100,
        })
      );
  }

  routes() {
    this.server.use(routes);

    // The error handler must be before any other error middleware
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const { status, message } = err;

      if (status && status !== 500)
        return res.status(status).json({ error: message });

      if (['development', 'test'].includes(process.env.NODE_ENV)) {
        const errors = await new Youch(err, req).toJSON();

        console.error(err);

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
