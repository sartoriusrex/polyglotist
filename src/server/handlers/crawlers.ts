import { Request, Response } from 'express';

const db = require('../database');
import crawlSource from '../crawler/index';

export default {
  crawlSources: async (req: Request, res: Response) => {
    const sources = req.body;

    // query db for urls to go to for each source;
    const urlsAndLangs = await Promise.all(
      sources.map(async (src: any) => {
        try {
          const url = await db.query(
            `SELECT url, language FROM sources WHERE name = $1`,
            [src]
          );
          return [src, url.rows[0].url, url.rows[0].language];
        } catch (err) {
          console.log(err);
          return '';
        }
      })
    );

    console.log(urlsAndLangs);

    // Loop through each source and initiates its crawl function
    const sourceTexts: any = await Promise.all(
      urlsAndLangs.map(async (url: any) => {
        const src = {
          name: url[0],
          url: url[1],
          language: url[2],
        };
        // return await crawlSource( src ); //return text and info for each source given name and url
        // returns the text data, the source (url), and the language
      })
    );

    if (sourceTexts.error || !sourceTexts)
      return res.status(500).send({ message: 'error crawling' });

    return res.status(200).send({ sourceTexts });
  },
};