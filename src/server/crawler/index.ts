import * as dotenv from 'dotenv';
dotenv.config();
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

import getContainerIP from '../utils/getContainerIp';
import { Error, CrawlResult, Crawler } from './interfaces';
import crawlerFunction from './crawlerFunction';

import figaro from './figaro';
import twenty from './twenty';
import monde from './monde';
import veinte from './veinte';
import pais from './pais';

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

  const chrome = await getContainerIP('chrome');

  const options = {
    uri: `http://${chrome}:9222/json/version`,
    json: true,
    resolveWithFullResponse: true
  }

  try {
    const response = await fetch(options);
    const webSocket = response.body.webSocketUrl;

    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocket
    });
    const page = await browser.newPage();
    page.setJavascriptEnabled(true);
    const { grabURLs, grabTitle, grabDate, grabBody } = crawlers[name];

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
    await page.waitFor(2000);

    const articleArray: CrawlResult[] | Error = await crawlerFunction(
      grabURLs,
      grabTitle,
      grabDate,
      grabBody,
      page,
      url,
      language
    );

    await browser.close();

    // Testing the articles crawled

    // 1. Check that the articleArray is in fact an array
    if (Array.isArray(articleArray)) {
      console.log('\n=+=+=+=+=+=+=++=+=+=+=+=+\n');
      let count: number = 0;

      // Loop through each Article in the array
      articleArray.forEach((article: CrawlResult) => {
        if (article.title == 'No Title Found') {
          console.log(`No title found from ${article.url}`);
        }

        if (
          article.date === 'No Date Found' ||
          article.date === 'Invalid Date'
        ) {
          console.log(`Bad Date at ${article.url}`);
        }

        // Check that the body is also an array
        if (Array.isArray(article.body)) {
          if (article.body.length <= 1) {
            count++;
            console.log(
              `\nProblem getting article body from ${article.url} \n`
            );
          }
        } else {
          console.log('\nArticle is not an array : ' + article.body + '\n');
        }
      });
      console.log(`
        ---------------------------------
        Problem Articles: ${count} / ${articleArray.length}
        ---------------------------------`);
      console.log(`
        =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
        =+=+=// All Done scraping ${name} //=+=+=+=+=
        =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=`);
    } else {
      console.log(`\nArticle array is not an array: ${articleArray}\n`);
    }

    return articleArray;
  } catch (err) {
    console.log(err);

    return { error: `Failed to scrape ${name}` };
  }
};

export default crawlSource;
