const crawlfigaro = async function (page: any, url: string, language: string) {
  try {
    let results = [];

    const RandomArticleUrls = await page.$$eval(
      'h2>a:not([aria-label])',
      (aTags: any, url: string) => {
        let urls = aTags
          .filter(
            (tag: any) =>
              tag.hostname === 'www.lefigaro.fr' &&
              tag.pathname.slice(0, 7) !== '/photos'
          )
          .map((tag: any) => tag.href);

        let max = urls.length;
        let numArticles = 3;

        const getRandomInt = (max: number) =>
          Math.floor(Math.random() * Math.floor(max));

        let randomIndexes = Array(numArticles)
          .fill(1)
          .map((num: number) => getRandomInt(max))
          .sort((a: number, b: number) => a - b)
          .map((num: number, i: number, arr: any[]) => {
            if (i > 0 && num === arr[i - 1]) return ++num;
            return num;
          });

        return randomIndexes.map((index: number) => urls[index]);
      },
      url
    );

    for (let url of RandomArticleUrls) {
      await page.goto(url);
      let title;
      let body;

      try {
        title = await page.$eval('h1', (title: any) => title.innerText);
      } catch (err) {
        console.log(err);
      }

      if (!title) {
        try {
          title = await page.$eval('h2', (title: any) => title.innerText)[0];
        } catch (err) {
          console.log(err);
          console.log('failed to retreive title 2nd time via getting first h2');
          return { error: 'Failed to get any title' };
        }
      }

      try {
        if (title.slice(0, 9) === 'EN DIRECT') {
          body = await page.$eval('.live-message.pinned', (body: any) => {
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
        } else {
          body = await page.$eval('#fig-article > div', async (body: any) => {
            if (body.innerText === 'Votre avis') {
              let commentsButtonClicked = await page.click(
                '#commentsTitle+ul+span'
              );

              if (!commentsButtonClicked) {
                return [
                  'P',
                  'There are not enough comments to display the survey question results',
                ];
              }

              let commentsContainer = Array.from(
                document.querySelectorAll('.figc-comments')
              );

              return commentsContainer.map((comment: any) => {
                const username = comment.querySelector(
                  '.figc_comment__username'
                );
                const date = comment.querySelector('.figc_comment__date');
                const text = comment.querySelector('.figc_comment__text');

                const returningArray: string[] = [username, date, text];

                returningArray.forEach((textData: string) => ['P', textData]);
              });
            }

            let children = Array.from(body.children);
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
        }

        results.push({ title, url, body, language });
      } catch (err) {
        console.log(err);
        return {
          error: 'Failed to get article Bodies from figaro.fr',
        };
      }
    }

    return results;
  } catch (err) {
    console.log(err);
    return { error: 'Failed to get article URLs from figaro.fr' };
  }
};

export default crawlfigaro;
