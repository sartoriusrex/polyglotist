import { Error, Crawler, Months } from './interfaces';

const paisCrawler: Crawler = {
  grabURLs: async function (page: any, url: string) {
    try {
      // Grab only center column articles that specifically match this query
      const randomArticleUrls = await page.$$eval(
        'article',
        (articles: any, url: string) => {
          // function checkParent used to check if parent meets the el-pais-in-english query, because they are not accessible
          // Function comes from https://www.geeksforgeeks.org/how-to-check-if-an-element-is-a-child-of-a-parent-using-javascript/
          function checkParent(parent: HTMLElement, child: HTMLElement) {
            let node = child.parentNode;

            // keep iterating unless null
            while (node != null) {
              if (node == parent) {
                return true;
              }
              node = node.parentNode;
            }
            return false;
          }
          // filter out articles 'en vivo' since they're a bit complicated for scraping (iframe with another url - may do these later)

          const articlesNoVivo = articles.filter(
            (element: any) =>
              !element.querySelector('.kicker span') &&
              element.querySelector('h2 a') &&
              !checkParent(element.closest('#el-pais-in-english'), element)
          );

          let urls = articlesNoVivo
            .map((element: any) => element.querySelector('h2 a').href)
            .filter(
              (href: string) =>
                href.slice(8, 14) === 'elpais' && !href.includes('album')
            );

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
      title = await page.$eval('h1', (title: any) => title.innerText);
    } catch (err) {
      console.log(err);
      console.log(`\n\n${url}\n\n`);
    }

    return title;
  },
  grabDate: async function (page: any, url: string) {
    let date: string;
    const months: Months = {
      ENE: 'january',
      FEB: 'february',
      MAR: 'march',
      ABR: 'april',
      MAY: 'may',
      JUN: 'june',
      JUL: 'july',
      AGO: 'august',
      SEP: 'september',
      OCT: 'october',
      NOV: 'november',
      DIC: 'december',
    };

    try {
      date = await page.$eval(
        '.a_ti',
        (timeElement: any, months: Months) => {
          const dateText = timeElement.innerText.slice(0, 11);
          let dateTimeObject = new Date(dateText);

          if (typeof dateTimeObject === 'string') {
            const dateTextArray = dateText.split(' ');
            const newDateText = dateTextArray
              .map((el: string) => {
                let mo = el.toUpperCase();
                if (months[mo]) return months[mo];
                return el;
              })
              .join(' ');

            dateTimeObject = new Date(newDateText);
          }

          return dateTimeObject.toLocaleString();
        },
        months
      );

      return date;
    } catch (err) {
      console.log('\n failed to grab .a_ti. Will now attempt 2nd capture');
    }

    try {
      date = await page.$eval(
        'time',
        (dateElement: any, months: Months) => {
          const dateText = dateElement.innerText.slice(0, 11);

          const dateTextInEnglish = dateText
            .split(' ')
            .map((el: any) => {
              let mo = el.toUpperCase();
              if (months[mo]) return months[mo];
              return el;
            })
            .join(' ');

          return new Date(dateTextInEnglish).toLocaleString();
        },
        months
      );

      return date;
    } catch (err) {
      console.log(err);
      return { error: `Failed to grab the time from ${url}` };
    }
  },
  grabBody: async function (page: any, url: string) {
    let body;

    // Different article types need to be treated differently
    try {
      body = await page.$eval(
        'article',
        async (body: any, url: string) => {
          let desc = null;
          if (body.querySelector('h1 + h2')) {
            desc = ['H2', body.querySelector('h1 + h2').innerText];
          }

          const articleBodyContainer =
            body.querySelector('.article_body') ||
            body.querySelector('.articulo-cuerpo') ||
            body.querySelector('.cuerpo');

          const allowedTags = ['P', 'H2', 'H3', 'BLOCKQUOTE', 'UL'];
          let articleText;

          if (articleBodyContainer !== null) {
            articleText = Array.from(articleBodyContainer.children)
              .filter((element: any) => allowedTags.includes(element.tagName))
              .map((element: any) => {
                if (element.tagName === 'UL') {
                  const ulChildren = Array.from(element.children);

                  return ulChildren.map((el: any) => [
                    el.tagName,
                    el.textContent,
                  ]);
                }
                return [element.tagName, element.textContent];
              });
          } else {
            articleText = [['H2', `No Body Found in ${url}`]];
          }

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

export default paisCrawler;
