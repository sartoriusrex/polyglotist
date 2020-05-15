import express, { Request, Response, Router } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import initializeDatabase from './database/init';

initializeDatabase();

export default function initializeServer(router: Router) {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const appOrigin = {
    origin: isProduction ? 'https://www.polyglotist.com' : '*',
  };
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
  });

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(cors(appOrigin));
  app.use(limiter);
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../../dist')));

  app.use('/api', router);

  // Serve any other file as dist for index.html
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });

  return app;
}