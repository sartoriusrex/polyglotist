import { Error, Crawler, Months } from './interfaces';

const twentyCrawler: Crawler = {
  grabURLs: async function (page: any, url: string) {
    try {
      const randomArticleUrls = await page.$$eval(
        'article a:not([class])',
        (aTags: any, url: string) => {
          let urls = aTags
            .filter((a: any) => {
              let href = a.getAttribute('href');
              return (
                href.slice(0, 1) === '/' &&
                !href.includes('logs6') &&
                !href.includes('pdf') &&
                !href.includes('diaporama')
              );
            })
            .map((a: any) => url.slice(0, -1) + a.getAttribute('href'));

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
      title = await page.$eval(
        'h1.nodeheader-title',
        (title: any) => title.innerText
      );
    } catch (err) {
      console.log(err);
      return { error: `Failed to get any title from ${url}` };
    }

    return title;
  },
  grabDate: async function (page: any, url: string) {
    let date;

    try {
      date = await page.$eval('.datetime > time', (timeElement: any) => {
        const dateAttribute = timeElement.getAttribute('datetime');
        const convertedDate = new Date(dateAttribute);
        return convertedDate.toLocaleString();
      });
    } catch (err) {
      console.log(err);
      return { error: `Failed to grab date from ${url}` };
    }

    return date;
  },
  grabBody: async function (page: any, url: string) {
    let body;

    try {
      body = await page.$eval('.lt-endor-body.content', (body: any) => {
        let allowedTags = ['P', 'H2', 'UL'];
        let children;
        const live = document.querySelector('.live-intro');

        if (live) {
          let liveIntro = Array.from(live.children);

          let liveBody = Array.from(
            document.querySelectorAll('.live-post-body.content')
          )
            .filter((block: any, idx: number) => idx < 3)
            .map((block: any) => Array.from(block.children))
            .flat(Infinity);

          children = [...liveIntro, ...liveBody];
        } else {
          children = Array.from(body.children);
        }

        const allowedChildren = children.filter((element: any) =>
          allowedTags.includes(element.tagName)
        );

        return allowedChildren.map((element: any) => {
          if (element.tagName === 'ul') {
            return element.children.map((el: any) => [
              el.tagName,
              el.innerText,
            ]);
          }

          return [element.tagName, element.innerText];
        });
      });
    } catch (err) {
      console.log(err);
      return {
        error: `Failed to get article bodies from ${url}`,
      };
    }

    return body;
  },
};

export default twentyCrawler;
