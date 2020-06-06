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

    console.log(`\n===\nCrawling ${name} \n===\n`);

    await page.goto(url, { timeout: 0 });
    await page.waitFor(2000);

    const articleArray: CrawlResult[] = await sourceCrawler(
      page,
      url,
      language
    );

    await browser.close();

    // Testing the articles crawled
    // 1. Check that the articleArray is in fact an array
    if (Array.isArray(articleArray)) {
      let count: number = 0;
      // Loop through each Article in the array
      articleArray.forEach((article: CrawlResult) => {
        // console.log('\n===\n');
        // console.log(article.title + '\n');

        // Check that the body is also an array
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
      console.log(
        `\n====\nArticles with body count greater than 2: ${count} / ${articleArray.length}\n====\n`
      );
      console.log(`All Done scraping ${name}\n`);
    } else {
      console.log(`Article array is not an array: ${articleArray}`);
    }

    return articleArray;
  } catch (err) {
    console.log(err);

    return { error: `Failed to scrape ${name}` };
  }
};

export default crawlSource;
