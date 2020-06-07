interface Error {
  error: string;
}

export const grabURLs = async function (page: any, url: string) {
  try {
    // Grab only center column articles that specifically match this query
    const randomArticleUrls = await page.$$eval(
      'section > div > h2>a:not([aria-label])',
      (aTags: any, url: string) => {
        // filter out articles with domain not lefigaro, such as madame articles. Also filter out photo articles, that have no text.
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
};

export const grabTitle = async function (page: any, url: string) {
  let title;

  try {
    title = await page.$eval('h1', (title: any) => title.innerText);
  } catch (err) {
    console.log(err);
    console.log(`\n\n${url}\n\n`);
  }

  // If we cannot grab an h1 for whatever reason, grab the first h2
  if (!title) {
    try {
      title = await page.$eval('h2', (title: any) => title.innerText);
    } catch (err) {
      console.log(err);
      return { error: `Failed to get any title from ${url}` };
    }
  }

  return title;
};

export const grabDate = async function (page: any, url: string) {
  let date: string;

  try {
    date = await page.$eval('time', (timeElement: any) => {
      const dateTimeObject = new Date(timeElement.dateTime);

      const theDate = dateTimeObject.toLocaleDateString();
      const theTime = dateTimeObject.toLocaleTimeString('fr');

      return `${theDate} ${theTime}`;
    });

    if (!date) {
      date = await page.$eval('.date', (dateElement: any) => {
        const dateText = dateElement.textContent.slice(9).split(' ');

        const months: { [key: string]: string } = {
          janvier: 'january',
          fevrier: 'february',
          marz: 'march',
          juin: 'june',
          juillet: 'july',
          aout: 'august',
          septembre: 'september',
          octobre: 'october',
          novembre: 'november',
          decembre: 'december',
        };

        const dateTextInEnglish = dateText
          .map((el: any) => {
            if (months[el]) return months[el];
            return el;
          })
          .join(' ');

        return new Date(dateTextInEnglish);
      });
    }
  } catch (err) {
    console.log(err);
    return { error: `Failed to grab the time from ${url}` };
  }

  return date;
};

export const grabBody = async function (page: any, title: string, url: string) {
  let body;

  // Different article types need to be treated differently
  try {
    body = await page.$$eval(
      '#fig-article > div',
      async (body: any, url: string) => {
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

          // click button to view all comments;
          seeAllCommentsButton.click();

          // Wait 5 seconds
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

              return returningArray.map((textData: string) => ['P', textData]);
            });
          } else {
            return {
              error: `Failed to retreive article comments from ${url}.`,
            };
          }
        }

        // This is the normal sequence for all other articles, marked with attribute [data-component]='fig-article-content or something like that
        const bodyContainer: any = body.filter((divElement: any) =>
          divElement.hasAttribute('data-component')
        )[0];

        let children = Array.from(bodyContainer.children);
        let allowedTags = ['P', 'H2', 'UL'];

        const allowedChildren = children.filter((element: any) =>
          allowedTags.includes(element.tagName)
        );

        // In the case of ul tags that have child elements, we grab their children and insert them into a flattened array with all the other non-ul elements
        const allChildren = allowedChildren
          .map((element: any) => {
            if (element.tagName === 'UL') {
              const { children } = element;
              return [...children];
            }
            return element;
          })
          .flat(1);

        // Some elements from ul flattened array above will be lis, or perhaps some other non-semantic tag. We will simply make them all p tags, otherwise they are the normal tags.
        return allChildren.map((element: any) => {
          if (element.tagName !== 'H2' && element.tagName !== 'P') {
            return ['P', element.innerText];
          }
          return [element.tagName, element.innerText];
        });
      },
      url
    );
  } catch (err) {
    console.log(err);
    return { error: `Failed to get article bodies from ${url}` };
  }

  return body;
};

const crawlfigaro = async function (page: any, url: string, language: string) {
  // go to main page, scrape for desired links to article pages and return 3 random articles, and scrape those pages for their contents;
  let results = [];

  const randomArticleUrls: string[] | Error = await grabURLs(page, url);

  if (!Array.isArray(randomArticleUrls)) return randomArticleUrls.error;

  for (let url of randomArticleUrls) {
    await page.goto(url);

    let title: string | Error = await grabTitle(page, url);
    if (typeof title !== 'string') title = 'No Title Found';

    let date: string | Error = await grabDate(page, url);
    if (typeof date !== 'string') date = 'No Date Found';

    let body: string[][] | Error = await grabBody(page, title, url);
    if (!Array.isArray(body)) body = [['H2', body.error]];

    results.push({ title, date, url, body, language });
  }

  return results;
};

export default crawlfigaro;
