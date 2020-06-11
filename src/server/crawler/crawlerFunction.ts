import { Error, GrabURLs, GrabTitle, GrabDate, GrabBody } from './interfaces';

export default async function (
  grabURLs: GrabURLs,
  grabTitle: GrabTitle,
  grabDate: GrabDate,
  grabBody: GrabBody,
  page: any,
  url: string,
  language: string
) {
  let results = [];

  const randomArticleUrls: string[] | Error = await grabURLs(page, url);
  if (!Array.isArray(randomArticleUrls)) return randomArticleUrls;

  for (let url of randomArticleUrls) {
    await page.goto(url, { timeout: 0 });

    let title: string | Error = await grabTitle(page, url);
    if (typeof title !== 'string') title = 'No Title Found';

    let date: string | Error = await grabDate(page, url);
    if (typeof date !== 'string') date = 'No Date Found';

    let body: string[][] | Error = await grabBody(page, url);
    if (!Array.isArray(body)) body = [['H2', body.error]];

    results.push({ title, date, url, body, language });
  }

  return results;
}
