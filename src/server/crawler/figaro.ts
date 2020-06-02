export const grabURLs = async function (page: any, url: string) {
  try {
    const randomArticleUrls = await page.$$eval(
      'h2>a:not([aria-label])',
      (aTags: any, url: string) => {
        let urls = aTags
          .filter(
            (tag: any) =>
              tag.hostname === 'www.lefigaro.fr' &&
              tag.pathname.slice(0, 7) !== '/photos'
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
        const numArticlesChoice = 10;
        const numArticles = Math.min(max, numArticlesChoice);

        return urls.slice(0, numArticles);
      },
      url
    );

    return randomArticleUrls;
  } catch (err) {
    console.log(err);
    return { error: 'Failed to get article URLs from figaro.fr' };
  }
};

export const grabTitle = async function (page: any, url: string) {
  let title;

  try {
    title = await page.$eval('h1', (title: any) => title.innerText);
  } catch (err) {
    console.log(err);
    console.log(`\n\n${url}`);
  }

  if (!title) {
    try {
      title = await page.$eval('h2', (title: any) => title.innerText);
    } catch (err) {
      console.log(err);
      console.log('failed to retreive title 2nd time via getting first h2');
      console.log(`\n\n${url}`);
      return { error: 'Failed to get any title' };
    }
  }

  return title;
};

export const grabBody = async function (page: any, title: string, url: string) {
  let body;

  // Different article types need to be treated differently

  // EN DIRECT articles have live-article tags which have a multitude of non-semantic tags which we will treat their inner text only as P tags
  if (title.slice(0, 9) === 'EN DIRECT') {
    console.log('\n EN DIRECT! \n');

    try {
      body = await page.$eval('.live-message', (body: any) => {
        console.log(body);
        console.log(body.children);
        let children = Array.from(body.children);

        return children.map((tag: any) => {
          if (tag.tagName === 'H2') {
            return [tag.tagName, tag.innerText];
          }
          if (tag.classList.includes('live-article')) {
            return ['P', tag.innerText];
          }
        });
      });
    } catch (err) {
      console.log('EN DIRECT body capture failed\n');
      console.log(err + '\n');
      console.log(`\n\n${url}\n\n`);
      return ['error', 'EN DIRECT body capture failed'];
    }
  } else {
    try {
      body = await page.$$eval('#fig-article > div', async (body: any) => {
        //  Votre Avis reader surveys aren't articles, but they often contain comments, which we are scraping here.
        if (body[0].innerText.toLowerCase() === 'votre avis') {
          const seeAllCommentsButton: any = document.querySelector(
            '#commentsTitle+ul+span'
          );

          if (!seeAllCommentsButton) {
            return [
              'P',
              'There are not enough comments to display the survey question results',
            ];
          }

          seeAllCommentsButton.click();

          await (async () =>
            setTimeout(() => {
              console.log('\n\n Waiting after button click \n\n');
            }, 5000));

          const commentsAside = document.querySelector('.figc-comments');

          if (commentsAside !== null) {
            const commentsContainer: any = Array.from(commentsAside.children);

            return commentsContainer.map((comment: any) => {
              const username = comment.querySelector('.figc-comment__username')
                .innerText;
              const date = comment.querySelector('.figc_comment__date')
                .innerText;
              const text = comment.querySelector('.figc_comment__text')
                .innerText;

              const returningArray: string[] = [username, date, text];

              returningArray.forEach((textData: string) => ['P', textData]);
            });
          } else {
            return ['error', 'no comments'];
          }
        }

        const bodyContainer: any = body.filter((divElement: any) =>
          divElement.hasAttribute('data-component')
        )[0];

        let children = Array.from(bodyContainer.children);
        let allowedTags = ['P', 'H2', 'UL'];

        const allowedChildren = children.filter((element: any) =>
          allowedTags.includes(element.tagName)
        );

        return allowedChildren.map((element: any) => {
          if (element.tagName === 'UL') {
            let listItems = Array.from(element.children);

            listItems.map((item: any) => [item.tagName, item.innerText]);
          }
          return [element.tagName, element.innerText];
        });
      });
    } catch (err) {
      console.log(err);
      console.log(`\n\n${url}\n\n`);
      return ['error', 'Failed to get article Bodies from figaro.fr'];
    }

    return body;
  }
};

const crawlfigaro = async function (page: any, url: string, language: string) {
  // go to main page, scrape for desired links to article pages and return 3 random articles, and scrape those pages for their contents;
  let results = [];

  const randomArticleUrls: string[] | { error: string } = await grabURLs(
    page,
    url
  );

  if (!Array.isArray(randomArticleUrls)) return randomArticleUrls.error;

  console.log(randomArticleUrls);

  for (let url of randomArticleUrls) {
    console.log(`\n${url}\n`);
    await page.goto(url);

    const title: string | { error: string } = await grabTitle(page, url);

    if (typeof title !== 'string') return title.error;

    const body: string[][] | { error: string } = await grabBody(
      page,
      title,
      url
    );

    if (!Array.isArray(body)) return body.error;

    results.push({ title, url, body, language });
  }

  return results;
};

export default crawlfigaro;
