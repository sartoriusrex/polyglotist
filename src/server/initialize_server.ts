import express, { Request, Response, Router } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';

import initializeDatabase from './database/init';
import fetchFreshArticles from './database/fetch_fresh_articles';

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

  (async function initializeData() {
    // await initializeDatabase();
    // await fetchFreshArticles();
  })();

  // after initializing Data, fetch fresh articles at 600 and 1800 every day using node-cron
  //There seem to be issues with this task - it gets called in an endless loop for some reason, and at a time that does not seem to match the params
  cron.schedule('* * 6,18 * * *', async () => {
    try {
      console.log(`-=-=-=-fetching new articles-=-=-=-`);

      return await fetchFreshArticles()
    } catch (err) {
      console.log(`%+%+%+%+ Error %+%+%+%\n${err}`)
    }

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
