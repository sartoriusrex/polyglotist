import { Error, Crawler, Months } from './interfaces';

const mondeCrawler: Crawler = {
  grabURLs: async function (page: any, url: string) {
    try {
      // Grab only center column articles that specifically match this query
      const randomArticleUrls = await page.$$eval(
        '.article:not(.article--nav):not(.article--video) > a:first-child',
        (aTags: any, url: string) => {
          // filter out articles with domain not lefigaro, such as madame articles. Also filter out photo articles, that have no text.
          let urls = aTags
            .filter(
              (articleLink: any) =>
                !articleLink.querySelector('.icon__premium') &&
                !articleLink.querySelector('.icon__label-live') &&
                !articleLink.querySelector('.article__info') &&
                !articleLink.querySelector('.icon__video')
            )
            .map((tag: any) => tag.href);

          // Shuffle the array in place: From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
          function shuffleArray(array: any) {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
          }

          shuffleArray(urls);

          const max = urls.length;
          const numArticlesChoice = max;
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

    // If we cannot grab an h1 for whatever reason, grab the article desc
    if (!title) {
      try {
        title = await page.$eval(
          '.article__title',
          (title: any) => title.innerText
        );
      } catch (err) {
        console.log(err);
        return { error: `Failed to get any title from ${url}` };
      }
    }

    return title;
  },
  grabDate: async function (page: any, url: string) {
    let date: string;
    const months: Months = {
      janvier: 'january',
      fevrier: 'february',
      marz: 'march',
      avril: 'april',
      mai: 'may',
      juin: 'june',
      juillet: 'july',
      aout: 'august',
      septembre: 'september',
      octobre: 'october',
      novembre: 'november',
      decembre: 'december',
    };

    try {
      date = await page.$eval(
        '.meta__date',
        (dateElement: any, months: Months) => {
          const rawDateText = dateElement.innerText;
          const endingPoint = rawDateText.indexOf('à') - 1;
          const slicedDateText = rawDateText.slice(7, endingPoint);

          let returnDate;

          if (slicedDateText === 'hier') {
            // Calculate yesterday's date from https://stackoverflow.com/questions/5511323/calculate-the-date-yesterday-in-javascript
            returnDate = ((d) => new Date(d.setDate(d.getDate() - 1)))(
              new Date()
            );
          } else if (slicedDateText === 'aujourd’hui') {
            returnDate = new Date();
          } else {
            const frenchDate = rawDateText.slice(
              rawDateText.indexOf('le') + 3,
              endingPoint
            );
            const frenchDateArray = frenchDate.split(' ');
            const convertedDate = frenchDateArray
              .map((el: string) => {
                let monthString = el.toLowerCase();
                if (months[monthString]) return months[monthString];
                return el;
              })
              .join(' ');

            returnDate = new Date(convertedDate);
          }

          return returnDate.toLocaleString();
        },
        months
      );

      return date;
    } catch (err) {
      console.log(
        `Failed to grab date from .meta__date in \n\n ${url} \n\n Attemping again with another method`
      );
    }

    try {
      date = await page.$eval(
        '.meta__publisher',
        (dateElement: any, months: Months) => {
          const rawDateText = dateElement.innerText;
          const endingPoint = rawDateText.indexOf('à') - 1;
          const slicedDateText = rawDateText.slice(7, endingPoint);

          let returnDate;

          if (slicedDateText === 'hier') {
            // Calculate yesterday's date from https://stackoverflow.com/questions/5511323/calculate-the-date-yesterday-in-javascript
            returnDate = ((d) => new Date(d.setDate(d.getDate() - 1)))(
              new Date()
            );
          } else if (slicedDateText === 'aujourd’hui') {
            returnDate = new Date();
          } else {
            const frenchDate = rawDateText.slice(
              rawDateText.indexOf('le') + 3,
              endingPoint
            );
            const frenchDateArray = frenchDate.split(' ');
            const convertedDate = frenchDateArray
              .map((el: string) => {
                let monthString = el.toLowerCase();
                if (months[monthString]) return months[monthString];
                return el;
              })
              .join(' ');

            returnDate = new Date(convertedDate);
          }

          return returnDate.toLocaleString();
        },
        months
      );

      return date;
    } catch (err) {
      console.log(
        `Failed to grab date from .meta__publisher in \n\n ${url} \n\n Attemping again with another method`
      );
    }

    try {
      date = await page.$eval(
        'time',
        (dateElement: any, months: Months) => {
          const dateText = dateElement.innerText;
          let convertedDateText;

          if (dateText.split('/').length > 1) {
            convertedDateText = dateText
              .split('/')
              .map((el: any, i: number, arr: string[]) => {
                if (i === 0) return arr[1];
                if (i === 1) return arr[0];
                return el;
              })
              .join('/');
          } else {
            convertedDateText = dateText
              .split(' ')
              .map((el: string) => {
                let monthString = el.toLowerCase();
                if (months[monthString]) return months[monthString];
                return el;
              })
              .join(' ');
          }

          convertedDateText = new Date(convertedDateText);

          return convertedDateText.toLocaleString();
        },
        months
      );

      return date;
    } catch (err) {
      console.log(
        `Failed to grab date from time element in \n\n ${url} \n\n Attemping again with another method`
      );
    }

    try {
      date = await page.$eval(
        '.summary__live-testimony-gray',
        (dateElement: any, months: Months) => {
          const rawDateText = dateElement.innerText;
          const endingPoint = rawDateText.indexOf('à') - 1;
          const slicedDateText = rawDateText.slice(7, endingPoint);

          let returnDate;

          if (slicedDateText === 'hier') {
            // Calculate yesterday's date from https://stackoverflow.com/questions/5511323/calculate-the-date-yesterday-in-javascript
            returnDate = ((d) => new Date(d.setDate(d.getDate() - 1)))(
              new Date()
            );
          } else if (slicedDateText === 'aujourd’hui') {
            return returnDate = new Date();
          } else {
            const frenchDate = rawDateText.slice(
              rawDateText.indexOf('le') + 3,
              endingPoint
            );
            const frenchDateArray = frenchDate.split(' ');
            const convertedDate = frenchDateArray
              .map((el: string) => {
                let monthString = el.toLowerCase();
                if (months[monthString]) return months[monthString];
                return el;
              })
              .join(' ');

            returnDate = new Date(convertedDate);
          }

          return returnDate.toLocaleString();
        },
        months
      );

      return date;
    } catch (err) {
      console.log(
        `Failed to grab date from .summary__live-testimony-gray in \n\n ${url} \n\n Attemping again with another method`
      );
    }

    return { error: `Failed to grab the time from ${url}` };
  },
  grabBody: async function (page: any, title: string, url: string) {
    let body;

    // Different article types need to be treated differently
    try {
      body = await page.$eval(
        'main',
        async (body: any, url: string) => {
          let desc = null;
          if (body.querySelector('.article__desc')) {
            desc = ['P', body.querySelector('.article__desc').innerText];
          }

          let filteredArticleContent: any;

          if (body.querySelector('.article__content')) {
            filteredArticleContent = Array.from(
              body.querySelector('.article__content').children
            ).filter((element: any) => {
              return (
                Array.from(element.classList).includes('article__paragraph') ||
                element.querySelector('h2') ||
                element.tagName === 'H2'
              );
            });
          } else if (body.querySelector('.entry-content')) {
            // Blog posts from lemonde have a different structure
            filteredArticleContent = Array.from(
              body.querySelector('.entry-content').children
            ).filter((element: any) => element.tagName === 'P');
          } else if (body.querySelector('.content.content__testimony')) {
            filteredArticleContent = Array.from(
              body.querySelector('.content.content__testimony').children
            ).filter((element: any) => element.tagName === 'P');
          }

          const articleContentArray = filteredArticleContent.map(
            (element: any) => {
              if (element.tagName !== 'P' && element.tagName !== 'H2') {
                const h2 = element.querySelector('h2');
                return [h2.tagName, h2.innerText];
              }
              return [element.tagName, element.innerText];
            }
          );

          if (desc) articleContentArray.unshift(desc);
          return articleContentArray;
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

export default mondeCrawler;
