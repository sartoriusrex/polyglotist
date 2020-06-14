import { Error, Crawler, Months } from './interfaces';

const figaroCrawler: Crawler = {
  grabURLs: async function (page: any, url: string) {
    try {
      // Grab only center column articles that specifically match this query
      const randomArticleUrls = await page.$$eval(
        'section > div > h2>a:not([aria-label])',
        (aTags: HTMLElement[], url: string) => {
          // filter out articles with domain not lefigaro, such as madame articles. Also filter out photo articles, that have no text.
          let urls = aTags
            .filter(
              (tag: any) =>
                tag.hostname === 'www.lefigaro.fr' &&
                tag.pathname.slice(0, 7) !== '/photos' &&
                !tag.pathname.includes('/story/')
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
  },
  grabTitle: async function (page: any, url: string) {
    let title;

    try {
      title = await page.$eval(
        'h1',
        (title: HTMLElement) => (<HTMLElement>title).innerText
      );
    } catch (err) {
      console.log(err);
      console.log(`\n\n${url}\n\n`);
    }

    // If we cannot grab an h1 for whatever reason, grab the first h2
    if (!title) {
      try {
        title = await page.$eval(
          'h2',
          (title: HTMLElement) => (<HTMLElement>title).innerText
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

    try {
      date = await page.$eval('time', (timeElement: HTMLTimeElement) => {
        const dateTimeObject = new Date(
          (<HTMLTimeElement>timeElement).dateTime
        );

        const theDate = dateTimeObject.toLocaleDateString();
        const theTime = dateTimeObject.toLocaleTimeString('fr');

        return `${theDate} ${theTime}`;
      });

      if (!date) {
        date = await page.$eval('.date', (dateElement: any) => {
          const dateText = dateElement.textContent.slice(9).split(' ');

          const months: Months = {
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
              const mo = el.toLowerCase();
              if (months[mo]) return months[mo];
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
  },
  grabBody: async function (page: any, url: string) {
    let body;

    // Different article types need to be treated differently
    try {
      body = await page.$$eval(
        '#fig-article > div',
        async (body: HTMLElement[], url: string) => {
          //  Votre Avis reader surveys aren't articles, but they often contain comments, which we are scraping here.
          if (body[0].innerText.toLowerCase() === 'votre avis') {
            const seeAllCommentsButton: HTMLElement | null = document.querySelector(
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
            async function wait(time: number) {
              return new Promise((res: any, rej: any) => {
                setTimeout(() => {
                  console.log('\n waiting...');
                  res();
                }, time);
              });
            }
            await wait(5000);

            const commentsAside = document.querySelector('.figc-comments');

            if (commentsAside !== null) {
              const commentsContainer: any = Array.from(commentsAside.children);

              return commentsContainer.map((comment: any) => {
                let username = comment.querySelector('.figc-comment__username');
                username = username === null ? 'n-a' : username.innerText;

                let date = comment.querySelector('.figc_comment__date');
                date = date === null ? 'n-a' : date.innerText;

                let text = comment.querySelector('.figc_comment__text');
                text = text === null ? 'n-a' : text.innerText;

                const returningArray: string[] = [username, date, text];

                return returningArray.map((textData: string) => [
                  'P',
                  textData,
                ]);
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
  },
};

export default figaroCrawler;
