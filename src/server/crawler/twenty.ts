const crawlTwenty = async function (page: any, url: string, language: string) {
  let results = [];

  try {
    const RandomArticleUrls = await page.$$eval(
      'article a:not([class])',
      (aTags: any, url: string) => {
        let urls = aTags
          .filter((a: any) => a.getAttribute('href').slice(0, 1) === '/')
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
        const numArticlesChoice = 3;
        const numArticles = Math.min(max, numArticlesChoice);

        return urls.slice(0, numArticles);
      },
      url
    );

    for (let url of RandomArticleUrls) {
      await page.goto(url);
      let title;
      let body;

      try {
        title = await page.$eval(
          'h1.nodeheader-title',
          (title: any) => title.innerText
        );
      } catch (err) {
        return { error: `Failed to capture title for ${url}` };
      }

      try {
        body = await page.$eval('.lt-endor-body.content', (body: any) => {
          let children = Array.from(body.children);
          let allowedTags = ['P', 'H2'];

          const allowedChildren = children.filter((element: any) =>
            allowedTags.includes(element.tagName)
          );

          return allowedChildren.map((element: any) => [
            element.tagName,
            element.innerText,
          ]);
        });

        results.push({ title, url, body, language });
      } catch (err) {
        console.log(err);
        return {
          error: `Failed to get article bodies from ${url}`,
        };
      }
    }

    return results;
  } catch (err) {
    console.log(err);
    return { error: 'Failed to get article URLs from Twenty.fr' };
  }
};

export default crawlTwenty;
