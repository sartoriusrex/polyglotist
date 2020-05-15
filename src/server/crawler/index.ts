const puppeteer = require('puppeteer');

const crawlSource = async function (src: {
  url: string;
  language: string;
  name: string;
}) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const sourceCrawler = require(`./${src.name}`);
  const { url, language } = src;

  if (src.name === 'figaro') {
    await page.goto(src.url);

    const text = await sourceCrawler(page, url, language);

    await browser.close();

    return text;
  }
};

export default crawlSource;
