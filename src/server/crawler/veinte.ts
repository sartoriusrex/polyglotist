import { Error, Crawler, Months } from './interfaces';

const veinteCrawler: Crawler = {
  grabURLs: async function (page: any, url: string) {
    try {
      // Grab only center column articles that specifically match this query
      const randomArticleUrls = await page.$$eval(
        'article h1 a',
        (aTags: HTMLAnchorElement[], url: string) => {
          let urls = aTags.map((tag: HTMLAnchorElement) => tag.href);

          // Shuffle the array in place: From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
          function shuffleArray(array: any) {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
          }

          shuffleArray(urls);

          const max = urls.length;
          const numArticlesChoice = 3;
          const numArticles = Math.min(max, numArticlesChoice);

          return urls.slice(0, numArticles);
        },
        url
      );

      return randomArticleUrls;
    } catch (err) {
      console.log(err);
      return { error: `Failed to get article URLs from ${url}` };
    }
  },
  grabTitle: async function (page: any, url: string) {
    let title;

    try {
      title = await page.$eval(
        'h1.article-title',
        (title: HTMLElement) => title.innerText
      );
    } catch (err) {
      console.log(err);
      console.log(`\n\n${url}\n\n`);
    }

    return title;
  },
  grabDate: async function (page: any, url: string) {
    let date;

    // new Date(document.querySelector('.article-date a').innerText.slice(0,10).split('.').map((el,i, arr)=> {if(i === 0) return arr[1]; if(i ===1)return arr[0]; return el}).join('/'))

    try {
      date = await page.$eval(
        '.article-date a',
        (timeElement: HTMLAnchorElement) => {
          const dateText = timeElement.innerText
            .slice(0, 10)
            .split('.')
            .map((el: string, idx: number, arr: string[]) => {
              if (idx === 0) return arr[1];
              if (idx === 1) return arr[0];
              return el;
            })
            .join('/');
          const convertedDate = new Date(dateText);
          return convertedDate.toLocaleString();
        }
      );
    } catch (err) {
      console.log(err);
      return { error: `Failed to grab date from ${url}` };
    }

    return date;
  },
  grabBody: async function (page: any, url: string) {
    let body;

    // Different article types need to be treated differently
    try {
      body = await page.$eval(
        'main',
        async (body: any, url: string) => {
          let desc = null;
          if (body.querySelector('.article-intro')) {
            desc = ['P', body.querySelector('.article-intro').innerText];
          }

          const articleText = Array.from(
            body.querySelector('.article-text').children
          )
            .filter((element: any) => element.tagName === 'P')
            .map((element: any) => [element.tagName, element.innerText]);

          if (desc) articleText.unshift(desc);
          return articleText;
        },
        url
      );
    } catch (err) {
      console.log(err);
      return { error: `Failed to get article bodies from ${url}` };
    }

    return body;
  },
};

export default veinteCrawler;
