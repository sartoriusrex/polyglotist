const crawlTwenty = async function (page: any, url: string, language: string) {
  try {
    //
    let results = [];
    const RandomArticleUrls = await page.$$eval(
      'article a:not([class])',
      (aTags: any, url: string) => {
        let urls = aTags
          .filter((a: any) => a.getAttribute('href').slice(0, 1) === '/')
          .map((a: any) => url.slice(0, -1) + a.getAttribute('href'));
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

      try {
        const title = await page.$eval(
          'h1.nodeheader-title',
          (title: any) => title.innerText
        );

        const body = await page.$eval('.lt-endor-body.content', (body: any) => {
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
          error: 'Failed to get article Titles or Bodies from Twenty.fr',
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
