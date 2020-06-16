import db from '../database';
import { Request, Response } from 'express';

import {
  DatabaseSource,
  CrawlResult,
  SourceText,
  Error,
} from '../crawler/interfaces';

interface Source {
  name: string;
  id: string;
}

export default {
  fetchFreshArticles: async (req: Request, res: Response) => {
    const sources: string[] = req.body;

    // query db source ids
    const databaseSources: DatabaseSource[] = await Promise.all(
      sources.map(async (src: string) => {
        try {
          const dbSource = await db.query(
            `SELECT * FROM sources WHERE name = $1`,
            [src]
          );

          return {
            name: dbSource.rows[0].name,
            url: dbSource.rows[0].url,
            language: dbSource.rows[0].language,
            id: dbSource.rows[0].id,
          };
        } catch (err) {
          console.log(err);

          return {
            name: 'n-a',
            url: 'n-a',
            language: 'n-a',
            id: 'n-a',
            error: `Failed to look up ${src} in database.`,
          };
        }
      })
    );

    // get the articles that are fresh from their source ids, and get those articles' bodies from the articles_bodies table
    const articles: SourceText[] = await Promise.all(
      databaseSources.map(async (src: DatabaseSource) => {
        if (src.hasOwnProperty('error')) {
          return { source: src };
        }

        const freshArticlesQuery = `
          SELECT * FROM articles WHERE AGE(NOW(), scraped_date) < '12 hours' AND source_id = $1;
        `;

        try {
          let srcArticles = await db.query(freshArticlesQuery, [src.id]);

          const freshArticleBodiesQuery = `
            SELECT tag, text FROM article_bodies WHERE article_id = $1 ORDER BY tag_order;
          `;

          try {
            const articlesAndBodies: CrawlResult[] = await Promise.all(
              srcArticles.rows.map(
                async (article: {
                  id: string;
                  article_date: string;
                  title: string;
                  url: string;
                }) => {
                  let articleBodyQueryResult = await db.query(
                    freshArticleBodiesQuery,
                    [article.id]
                  );

                  let articleBody: string[][] = articleBodyQueryResult.rows.map(
                    (result: any) => [result.tag, result.text]
                  );

                  return {
                    title: article.title,
                    date: article.article_date,
                    language: src.language,
                    url: article.url,
                    body: articleBody,
                  };
                }
              )
            );

            return {
              source: src,
              articles: articlesAndBodies,
            };
          } catch (err) {
            console.log(
              err,
              `\n failed to fetch article bodies from ${srcArticles.rows}`
            );

            return {
              // title: article.title,
              // date: article.article_date,
              // url: article.url,
              // source: src.name,
              // body: ['P', 'Failed to grab article text.'],
              source: src,
              error: 'Failed to grab article text.',
            };
          }
        } catch (err) {
          console.log(
            err,
            `\n handlers/articles.ts fetching articles after grabbing sources.`
          );

          return {
            error: 'Failed to fetch fresh articles from the database.',
            source: src,
          };
        }
      })
    );

    return res.status(200).send(articles);
  },
  fetchArticles: async (req: Request, res: Response) => {},
  fetchOneArticle: async (req: Request, res: Response) => {},
  addArticle: async (req: Request, res: Response) => {},
  updateArticle: async (req: Request, res: Response) => {},
  deleteArticle: async (req: Request, res: Response) => {},
};
