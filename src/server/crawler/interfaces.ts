export interface Error {
  error: string;
}

export interface Crawler {
  grabURLs: (page: any, url: string) => Promise<string[] | Error>;
  grabTitle: (page: any, url: string) => Promise<string | Error>;
  grabDate: (page: any, url: string) => Promise<string | Error>;
  grabBody: (
    page: any,
    url: string,
    title: string
  ) => Promise<string[][] | Error>;
}

export interface CrawlResult {
  title: string;
  date: string;
  url: string;
  language: string;
  body: string[][];
  error?: string;
}
