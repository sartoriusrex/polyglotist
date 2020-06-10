import express, { Request, Response, Router } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import initializeDatabase from './database/init';
import crawl from './crawler';

initializeDatabase();

// test crawl functions
// define interface for src object
interface SrcObj {
  url: string;
  name: string;
  language: string;
}

// transform text for init sources function in /database/init.ts, returning object matching instance of SrcObj
let transformInitSourceText = function (
  name: string,
  url: string,
  language: string
): SrcObj {
  let srcObject: SrcObj = {
    url,
    name,
    language,
  };

  return srcObject;
};

let src: SrcObj = transformInitSourceText(
  'figaro',
  'https://www.lefigaro.fr/',
  'french'
);

// src = transformInitSourceText('monde', 'https://www.lemonde.fr/', 'french');
// src = transformInitSourceText('twenty', 'https://www.20minutes.fr/', 'french');
src = transformInitSourceText(
  'veinte',
  'https://www.20minutos.com/',
  'spanish'
);

let getText = async function (src: SrcObj) {
  try {
    return await crawl(src);
  } catch (err) {
    return { message: err.message };
  }
};

let text = getText(src);

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
