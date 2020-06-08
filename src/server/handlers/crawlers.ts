import { Request, Response } from 'express';

import { DatabaseSource, CrawlResult, SourceText } from './interfaces';
import db from '../database';
import crawlSource from '../crawler/index';

export default {
  crawlSources: async (req: Request, res: Response) => {
    const sources: string[] = req.body;

    // query db for urls to go to for each source;
    const databaseSources: DatabaseSource[] = await Promise.all(
      sources.map(async (src: string) => {
        try {
          const dbSource = await db.query(
            `SELECT url, language FROM sources WHERE name = $1`,
            [src]
          );
          return {
            name: src,
            url: dbSource.rows[0].url,
            language: dbSource.rows[0].language,
          };
        } catch (err) {
          console.log(err);

          return {
            name: 'n-a',
            url: 'n-a',
            language: 'n-a',
            error: `Failed to look up ${src} in database.`,
          };
        }
      })
    );

    // Loop through each source and initiates its crawl function
    const sourceTexts: SourceText[] = await Promise.all(
      databaseSources.map(async (source: DatabaseSource) => {
        try {
          if (source.hasOwnProperty('error')) return { source };
          const articles: CrawlResult[] | { error: string } = await crawlSource(
            source
          ); //return text and info for each source given name and url
          // returns the text data, the source (url), and the language
          return { source, articles };
        } catch (err) {
          console.log(err);

          return { source, error: `Failed to crawl ${source}}` };
        }
      })
    );

    return res.status(200).send(sourceTexts);
  },
};
