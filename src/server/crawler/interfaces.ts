export interface Error {
  error: string;
}

export type GrabURLs = (page: any, url: string) => Promise<string[] | Error>;
export type GrabTitle = (page: any, url: string) => Promise<string | Error>;
export type GrabDate = (page: any, url: string) => Promise<string | Error>;
export type GrabBody = (page: any, url: string) => Promise<string[][] | Error>;

export interface Crawler {
  grabURLs: GrabURLs;
  grabTitle: GrabTitle;
  grabDate: GrabDate;
  grabBody: GrabBody;
}

export interface CrawlResult {
  title: string;
  date: string;
  url: string;
  language: string;
  body: string[][];
  error?: string;
}

export interface Months {
  [key: string]: string;
}
