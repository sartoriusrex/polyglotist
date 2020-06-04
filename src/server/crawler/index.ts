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
}

const crawlSource = async function (src: {
  url: string;
  language: string;
  name: string;
}) {
  const crawlers: any = { figaro, twenty, monde, veinte, pais };

  try {
    const browser = await puppeteer.launch({ headless: headless });
    const page = await browser.newPage();
    const { url, language, name } = src;
    const sourceCrawler: any = crawlers[name];

    await page.goto(url);

    const articleArray: CrawlResult[] | string = await sourceCrawler(
      page,
      url,
      language
    );

    await browser.close();

    if (Array.isArray(articleArray)) {
      articleArray.forEach((article: CrawlResult) => {
        // console.log('\n===\n');
        // console.log(article.title + '\n');
        if (Array.isArray(article.body)) {
          if (article.body.length <= 2) {
            console.log(article.url + '\n');
            article.body.forEach((bodyArray: string[]) => {
              console.log(bodyArray + '\n');
            });
          }
        } else {
          console.log(article.body);
        }
      });
      console.log(`===\n${articleArray.length}\n===`);
      console.log('\nAll Done scraping\n');
    } else {
      console.log(articleArray);
    }

    return articleArray;
  } catch (err) {
    console.log(err);
  }
};

export default crawlSource;
