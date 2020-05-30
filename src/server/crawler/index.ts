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

      const text: Array<CrawlResult> | { error: string } = await sourceCrawler(
        page,
        url,
        language
      );

      await browser.close();

      // console.log(text);
      // console.log(`\n\n\n text length is ${Object.entries(text).length}\n\n\n`);
      // Object.entries(text).forEach((item: any) => {
      //   console.log(`\n\n${Object.entries(item)}\n\n`);
      //   // console.log('title ' + item.title);
      //   // console.log('text body length is ' + item.body.length);
      //   // item.body.forEach((bodyItem: any) => {
      //   //   console.log(bodyItem[0]);
      //   // });
      // });

      return text;
    }
  } catch (err) {
    console.log(err);
  }
};

export default crawlSource;
