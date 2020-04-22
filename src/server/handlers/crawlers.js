const db = require('../database');
const crawlSource = require('../crawler/index');

module.exports = {
  crawlSources: async (req, res) => {
    const sources = req.body;

    // query db for urls to go to for each source;
    const urlsAndLangs = await Promise.all(
      sources.map( async src => {
        try {
          const url = await db.query(
            `SELECT url, language FROM sources WHERE name = $1`,
            [src]
          )
          return [src, url.rows[0].url, url.rows[0].language];
        } catch (err) {
          console.log(err);
          return ''
        }
      })
    );

    // Loop through each source and initiates its crawl function
    const sourceTexts = await Promise.all(
      urlsAndLangs.map( async url => {
        const src = {
          name: url[0],
          url: url[1],
          language: url[2]
        }
        return await crawlSource( src ); //return text and info for each source given name and url
        // returns the text data, the source (url), and the language
      })
    );

    if (sourceTexts.error) return res
      .status(500)
      .send({message: 'error crawling'});

    return res
      .status(200)
      .send({sourceTexts});
  }
}