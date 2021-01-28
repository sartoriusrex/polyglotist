import puppeteer from 'puppeteer';

import { Error, CrawlResult, Crawler } from './interfaces';
import crawlerFunction from './crawlerFunction';

import figaro from './figaro';
import twenty from './twenty';
import monde from './monde';
import veinte from './veinte';
import pais from './pais';

const headless = true;

const crawlSource = async function (src: {
  url: string;
  language: string;
  name: string;
}) {
  const crawlers: { [key: string]: Crawler } = {
    figaro,
    twenty,
    monde,
    veinte,
    pais,
  };
  const { url, language, name } = src;
  let browser;

  try {
    browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage', '--no-sandbox'],
      headless
    });
    const page = await browser.newPage();
    page.setJavaScriptEnabled(true);
    const { 
      grabURLs, 
      grabTitle, 
      grabDate, 
      grabBody 
    } = crawlers[name];

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
    await page.waitFor(2000);

    let articleArray: CrawlResult[] | Error = await crawlerFunction(
      grabURLs,
      grabTitle,
      grabDate,
      grabBody,
      page,
      url,
      language
    );

    await page.close();

    // Testing the articles crawled

    // 1. Check that the articleArray is in fact an array
    if (Array.isArray(articleArray)) {
      console.log('\n=+=+=+=+=+=+=++=+=+=+=+=+\n');
      let count: number = 0;

      // Loop through each Article in the array
      articleArray = articleArray.filter((article: CrawlResult) => {
        if (article.title == 'No Title Found') {
          count++;
          console.log(`No title found from ${article.url}`);
          return false;
        }

        if (
          article.date === 'No Date Found' ||
          article.date === 'Invalid Date'
        ) {
          count++;
          console.log(`Bad Date at ${article.url}`);
          return false;
        }

        // Check that the body is also an array
        if (Array.isArray(article.body)) {
          if (article.body.length <= 1) {
            count++;
            console.log(
              `\nProblem getting article body from ${article.url} \n`
            );
            return false;
          }
        } else {
          count++;
          console.log('\nArticle is not an array : ' + article.body + '\n');
          return false;
        }

        return true;
      });
      console.log(`
        ---------------------------------
        Problem Articles: ${count} / ${articleArray.length}
        ---------------------------------`);
      console.log(`
        =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
        =+=+=// All Done scraping ${name} //=+=+=+=+=
        =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=`);

      articleArray = Array.from(new Set(articleArray));
    } else {
      console.log(`\nArticle array is not an array: ${articleArray}\n`);
      return { error: `Failed to scrape ${name}`};
    }

    return articleArray;
  } catch (err) {
    console.log(err);

    return { error: `Failed to scrape ${name}` };
  } finally {
    console.log(`
        ---------- Closing Browser and exiting Process --------
    `);

    if (browser) await browser.close();
  }
};

export default crawlSource;
