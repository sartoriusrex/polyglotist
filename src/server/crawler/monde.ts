interface Error {
  error: string;
}

export const grabURLs = async function (page: any, url: string) {
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
              !articleLink.querySelector('.article__info')
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
};

export const grabTitle = async function (page: any, url: string) {
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
};

export const grabDate = async function (page: any, url: string) {
  let date: string;
};

export const grabBody = async function (page: any, title: string, url: string) {
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
        } else {
          // Blog posts from lemonde have a different structure
          filteredArticleContent = Array.from(
            body.querySelector('.entry-content').children
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
};

const crawlMonde = async function (page: any, url: string, language: string) {
  // go to main page, scrape for desired links to article pages and return 3 random articles, and scrape those pages for their contents;
  let results = [];

  const randomArticleUrls: string[] | Error = await grabURLs(page, url);
  if (!Array.isArray(randomArticleUrls)) return randomArticleUrls.error;

  for (let url of randomArticleUrls) {
    await page.goto(url);

    let title: string | Error = await grabTitle(page, url);
    if (typeof title !== 'string') title = 'No Title Found';

    // let date: string | Error = await grabDate(page, url);
    // if (typeof date !== 'string') date = 'No Date Found';

    let body: string[][] | Error = await grabBody(page, title, url);
    if (!Array.isArray(body)) body = [['H2', body.error]];

    results.push({ title, url, body, language });
  }

  return results;
};

export default crawlMonde;
