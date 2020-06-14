import db from './index';
import crawlSource from '../crawler';
import { SrcObj, CrawlResult, Error, SourceText } from '../crawler/interfaces';
import sources from '../crawler/all_sources';

// test crawl functions; declare test to be true and if true, make sure to correctly reference the source to test in crawlers/all_sources.ts, referenced as sources variable.
const test = false;
let src: SrcObj;

async function testCrawler(src: SrcObj) {
  try {
    const testCrawlResult: CrawlResult[] | Error = await crawlSource(src);
    console.log(testCrawlResult);
  } catch (err) {
    console.log(err, '\nfetch_fresh_articles.ts line 15 in testCrawler fxn.\n');
  }
}

const find_source_id = `
  SELECT id FROM sources WHERE name = $1;
`;

const insert_article = `
  INSERT INTO articles (title, article_date, source_id, url) VALUES
  ($1, $2, $3, $4) RETURNING id;
`;

const insert_bodies = `
  INSERT INTO article_bodies (article_id, tag_order, tag, text) VALUES
  ($1, $2, $3, $4);
`;

const fetchFreshArticles = async function () {
  if (test) {
    return await testCrawler(src);
  } else {
    const newArticles: SourceText[] = await Promise.all(
      sources.map(async (source: SrcObj) => {
        try {
          let articles: CrawlResult[] | Error = await crawlSource(source);
          return { source, articles };
        } catch (err) {
          console.log(
            err,
            '\nfetch_fresh_articles.ts in fetchFreshArticles function line 43.\n'
          );
          return { source, error: `failed to crawl ${source}` };
        }
      })
    );

    return await Promise.all(
      newArticles.map(async (src: SourceText) => {
        let { source, articles, error } = src;
        let id: string;

        if (error)
          return {
            error: `Crawler failed to find articles for ${source.name}`,
          };

        try {
          let result = await db.query(find_source_id, [source.name]);
          id = result.rows[0].id;
        } catch (err) {
          console.log(err, '\nfetch_fresh_articles.ts line 66.\n');
          return { error: `Failed to find source_id for ${source.name}` };
        }

        if (Array.isArray(articles)) {
          await Promise.all(
            articles.map(async (article: CrawlResult) => {
              const { title, date, url, body } = article;

              try {
                let article_id_query = await db.query(insert_article, [
                  title,
                  date,
                  id,
                  url,
                ]);

                let article_id = article_id_query.rows[0].id;

                await Promise.all(
                  body.map(async (bodyText: string[], idx: number) => {
                    try {
                      await db.query(insert_bodies, [
                        article_id,
                        idx,
                        bodyText[0],
                        bodyText[1],
                      ]);
                    } catch (err) {
                      console.log(err, '\nfetch_fresh_articles line 95\n');
                      return {
                        error: `Failed to insert article bodies for ${article_id}`,
                      };
                    }
                  })
                );
              } catch (err) {
                console.log(err);
                return {
                  error: `Failed to correctly return article_id or insert article for ${title} from ${url}`,
                };
              }
            })
          );

          console.log(
            `\n
            =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=++=+=+=
            +=// inserted articles for ${source.name} into db. //=+
            =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
            `
          );
        } else {
          return { error: 'There are no articles to put into the db.' };
        }
      })
    );
  }
};

export default fetchFreshArticles;
