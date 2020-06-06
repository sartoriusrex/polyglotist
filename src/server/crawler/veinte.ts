export const grabURLs = async function (page: any, url: string) {
  try {
    // Grab only center column articles that specifically match this query
    const randomArticleUrls = await page.$$eval(
      'article h1 a',
      (aTags: any, url: string) => {
        let urls = aTags.map((tag: any) => tag.href);

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

  return title;
};

export const grabBody = async function (page: any, title: string, url: string) {
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
};

const crawlVeinte = async function (page: any, url: string, language: string) {
  // go to main page, scrape for desired links to article pages and return 3 random articles, and scrape those pages for their contents;
  let results = [];

  const randomArticleUrls: string[] | { error: string } = await grabURLs(
    page,
    url
  );

  if (!Array.isArray(randomArticleUrls)) return randomArticleUrls.error;

  for (let url of randomArticleUrls) {
    await page.goto(url);

    let title: string | { error: string } = await grabTitle(page, url);

    if (typeof title !== 'string') title = 'No Title Found';

    let body: string[][] | { error: string } = await grabBody(page, title, url);

    if (!Array.isArray(body)) {
      body = [['H2', body.error]];
    }

    results.push({ title, url, body, language });
  }

  return results;
};

export default crawlVeinte;
