import db from '../database';
import { Request, Response } from 'express';

import {
  DatabaseSource,
  CrawlResult,
  SourceText,
} from '../crawler/interfaces';

import {
  IUsersArticles
} from '../interfaces';

import {
  select_all_from_source_from_name,
  select_new_articles,
  select_all_from_users_articles_from_user_id,
  select_all_from_articles_from_id,
  select_all_from_article_bodies_from_id,
  select_all_from_sources_from_id,
  select_all_from_articles_from_title,
  select_all_from_users_articles_from_user_and_article_id,
  insert_users_articles,
  update_article_reference_from_id
} from '../queries';

export default {
  fetchFreshArticles: async (req: Request, res: Response) => {
    const sources: string[] = req.body;

    // query db source ids
    const databaseSources: DatabaseSource[] = await Promise.all(
      sources.map(async (src: string) => {
        try {
          const dbSource = await db.query( select_all_from_source_from_name, [src] );

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

        try {
          let srcArticles = await db.query(select_new_articles, [src.id]);

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
                    select_all_from_article_bodies_from_id, 
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
  fetchArticles: async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
      const usersArticlesResult = await db.query(
        select_all_from_users_articles_from_user_id, 
        [id]
      );
      const usersArticles: IUsersArticles[] = usersArticlesResult.rows;

      const articles = await Promise.all(usersArticles.map(async (userArticle: IUsersArticles) => {
        const { article_id } = userArticle;

        const articleResult = await db.query(
          select_all_from_articles_from_id, 
          [article_id]
        );
        let article = articleResult.rows[0];
        const { source_id } = article;
        const articleBodyResult = await db.query(
          select_all_from_article_bodies_from_id,
          [article_id]
        );
        const articleBodies = articleBodyResult.rows.map((result: any) => [result.tag, result.text]);
        const sourceResult = await db.query(
          select_all_from_sources_from_id,
          [source_id]
        );
        const source = sourceResult.rows[0];

        article = {
          title: article.title,
          date: article.article_date,
          language: source.language,
          url: article.url,
          body: articleBodies,
          source: source.name,
        }

        return article;
      }));

      res.status(200).send({ articles });
    } catch (err) {
      console.log(err);

      res.status(500).send({ error: err });
    }
  },
  fetchOneArticle: async (req: Request, res: Response) => { },
  addArticle: async (req: Request, res: Response) => {
    const { userId, articleTitle } = req.body;

    try {
      // Check to see if relationship already exists between user and article, meaning if the user had already added it.
      // If so, return 200 with the article, stating it already exists
      // Otherwise, create the relationship;

      const articleResult = await db.query(
        select_all_from_articles_from_title,
        [articleTitle]
      );
      const article = articleResult.rows[0];
      const userArticleResult = await db.query(
        select_all_from_users_articles_from_user_and_article_id, 
        [userId, article.id]
      );
      const userArticle = userArticleResult.rows[0];

      const { source_id } = article;
      const articleBodyResult = await db.query(
        select_all_from_article_bodies_from_id,
        [article.id]
      );
      const articleBodies = articleBodyResult.rows.map((result: any) => [result.tag, result.text]);
      const sourceResult = await db.query(
        select_all_from_sources_from_id,
        [source_id]
      );
      const source = sourceResult.rows[0];

      const articleResponse = {
        title: article.title,
        date: article.article_date,
        language: source.language,
        url: article.url,
        body: articleBodies,
        source: source.name,
      }

      if (userArticle !== undefined) {
        return res.status(200).send({
          message: "Article already added",
          article: articleResponse
        })
      }

      // Update referenced field in Article
      await db.query(
        update_article_reference_from_id, 
        [true, article.id]
      );

      const addUserArticleResult = await db.query(
        insert_users_articles,
        [userId, article.id]
      );
      const addUserArticle = addUserArticleResult.rows[0];

      // If we failed to add relationship
      if (addUserArticle.length <= 0) return res.status(500).send({ error: 'Failed to add article' });

      res.status(200).send({ message: "Added Article", article: articleResponse })
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err })
    }
  },
  updateArticle: async (req: Request, res: Response) => { },
  deleteArticle: async (req: Request, res: Response) => { },
};
