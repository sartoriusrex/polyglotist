import db from './index';
import crawlSource from '../crawler';
import { 
  SrcObj,
  CrawlResult,
  Error, 
  SourceText 
} from '../crawler/interfaces';
import sources from '../crawler/all_sources';
import { 
  select_id_from_source_from_name,
  insert_article,
  insert_article_bodies,
  delete_unused_articles
} from '../queries';

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
            '\nfetch_fresh_articles.ts in fetchFreshArticles function line 50 crawling sources.\n'
          );

          return { source, error: `failed to crawl ${source}` };
        }
      })
    );

    if (Array.isArray(newArticles) && !newArticles.hasOwnProperty('error')) {
      try {
        await db.query(delete_unused_articles);
      } catch (err) {
        console.log(
          err,
          '\nfetch_fresh_articles line 64, removeUnusedArticles fn.\n'
        );

        return { error: 'Failed to remove unused Articles' };
      }
    }

    await Promise.all(
      newArticles.map(async (src: SourceText) => {
        let { source, articles, error } = src;
        let id: string;

        if (error)
          return {
            error: `Crawler failed to find articles for ${source.name}`,
          };

        try {
          let result = await db.query(
            select_id_from_source_from_name,
            [source.name]
          );
          id = result.rows[0].id;
        } catch (err) {
          console.log(
            err,
            `\nfetch_fresh_articles.ts line 87, find_source_id for ${source.name}.\n`
          );

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
                      await db.query(insert_article_bodies, [
                        article_id,
                        idx,
                        bodyText[0],
                        bodyText[1],
                      ]);
                    } catch (err) {
                      console.log(
                        err,
                        `\nfetch_fresh_articles line 120, insert_bodies for ${article_id}.\n`
                      );

                      return {
                        error: `Failed to insert article bodies for ${article_id}`,
                      };
                    }
                  })
                );
              } catch (err) {
                console.log(
                  err,
                  `fetch_fresh_articles line 132, inserting ${title} from ${url} `
                );

                return {
                  error: `Failed to correctly return article_id or insert article for ${title} from ${url}`,
                };
              }
            })
          );

          console.log(`
          +=// inserted articles for ${source.name} into db. //=+
          `);
        } else {
          return { error: 'There are no articles to put into the db.' };
        }
      })
    );

    let time = new Date();
    console.log(`
          ==============================
          time: ${time}
          ==============================
      `);
  }
};

export default fetchFreshArticles;
