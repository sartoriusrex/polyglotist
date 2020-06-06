const puppeteer = require('puppeteer');
import figaro from './figaro';
import twenty from './twenty';
import monde from './monde';
import veinte from './veinte';
import pais from './pais';

const headless = true;

interface CrawlResult {
  title: string;
  url: string;
  language: string;
  body: string[][];
  error?: string;
}

const crawlSource = async function (src: {
  url: string;
  language: string;
  name: string;
}) {
  const crawlers: any = { figaro, twenty, monde, veinte, pais };
  const { url, language, name } = src;

  try {
    const browser = await puppeteer.launch({ headless: headless });
    const page = await browser.newPage();
    const sourceCrawler: any = crawlers[name];

    await page.goto(url, { timeout: 0 });
    await page.waitFor(2000);

    const articleArray: CrawlResult[] = await sourceCrawler(
      page,
      url,
      language
    );

    await browser.close();

    if (Array.isArray(articleArray)) {
      let count: number = 0;
      articleArray.forEach((article: CrawlResult) => {
        // console.log('\n===\n');
        // console.log(article.title + '\n');
        if (Array.isArray(article.body)) {
          // if (article.body.length <= 2) {
          //   console.log(article.url + '\n');
          //   article.body.forEach((bodyArray: string[]) => {
          //     console.log(bodyArray + '\n');
          //   });
          // }
          // console.log('\n===\n');
          // console.log(article.title);
          // console.log(article.url);
          // console.log('\n');
          // article.body.forEach((bd: any) => console.log(bd));
          if (article.body.length > 2) {
            count++;
          } else {
            console.log(article.url);
          }
        } else {
          console.log(article.body);
        }
      });
      console.log('articles with body count greather than 2: ', count);
      console.log(`===\n${articleArray.length}\n===`);
      console.log('\nAll Done scraping\n');
    } else {
      console.log(articleArray);
    }

    return articleArray;
  } catch (err) {
    console.log(err);

    return { error: `Failed to scrape ${name}` };
  }
};

export default crawlSource;
