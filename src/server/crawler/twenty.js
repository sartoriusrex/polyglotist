const crawlTwenty = async function (page, url, language) {
  try {
    // 
    let results = [];
    const RandomArticleUrls = await page.$$eval(
      'article a:not([class])',
      (aTags, url) => {
        let urls = aTags
          .filter((a) => a.getAttribute('href').slice(0, 1) === '/')
          .map((a) => url.slice(0, -1) + a.getAttribute('href'));
        let max = urls.length;
        let numArticles = 3;
        const getRandomInt = (max) =>
          Math.floor(Math.random() * Math.floor(max));

        let randomIndexes = Array(numArticles)
          .fill(1)
          .map((num) => getRandomInt(max))
          .sort((a, b) => a > b)
          .map((num, i, arr) => {
            if (i > 0 && num === arr[i - 1]) return ++num;
            return num;
          });

        return randomIndexes.map((index) => urls[index]);
      },
      url
    );

    for (let url of RandomArticleUrls) {
      await page.goto(url);

      try {
        const title = await page.$eval('h1.nodeheader-title', title => title.innerText );

        const body = await page.$eval('.lt-endor-body.content', (body) => {
          let children = Array.from(body.children);
          let allowedTags = ['P', 'H2'];

          const allowedChildren = children.filter((element) =>
            allowedTags.includes(element.tagName)
          );

          return allowedChildren.map((element) => [
            element.tagName,
            element.innerText,
          ]);
        });

        results.push({ title, url, body, language });
      } catch (err) {
        console.log(err);
        return { error: 'Failed to get article Titles or Bodies from Twenty.fr'}
      }
    }

    return results;
  } catch (err) {
    console.log(err);
    return { error: 'Failed to get article URLs from Twenty.fr'}
  }
};

module.exports = crawlTwenty;
