const puppeteer = require('puppeteer');

const crawlSource = async function( src ) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goTo( src.url );

  await browser.close();
}

module.exports = crawlSource;