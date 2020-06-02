const puppeteer = require('puppeteer');
import figaro from './figaro';
import twenty from './twenty';

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
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const { url, language } = src;
    const sourceCrawler = figaro;

    if (src.name === 'figaro') {
      await page.goto(src.url);

      const articleArray: CrawlResult[] | string = await sourceCrawler(
        page,
        url,
        language
      );

      await browser.close();

      console.log('\n\n\n');
      if (Array.isArray(articleArray)) {
        articleArray.forEach((article: CrawlResult) => {
          console.log('title : ' + article.title + '\n');
          console.log('url: ' + article.url + '\n');
          article.body.forEach((body: string[]) => {
            console.log(body[0]);
            console.log(body[1]);
          });
          console.log('\n=======\n');
        });
      } else {
        console.log(articleArray);
      }
      return articleArray;
    }
  } catch (err) {
    console.log(err);
  }
};

export default crawlSource;
