export interface Error {
  error: string;
}

export type GrabURLs = (page: any, url: string) => Promise<string[] | Error>;
export type GrabTitle = (page: any, url: string) => Promise<string | Error>;
export type GrabDate = (page: any, url: string) => Promise<string | Error>;
export type GrabBody = (page: any, url: string) => Promise<string[][] | Error>;

export interface DatabaseSource {
  name: string;
  url: string;
  language: string;
  id?: string;
  error?: string;
}

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

export interface SourceText {
  source: DatabaseSource;
  articles?: CrawlResult[] | Error;
  error?: string;
}

export interface Article {
  title: string;
  date: string;
  url: string;
  language: string;
  body: string[][];
  source: string;
}

export interface Articles {
  error?: string;
  articles?: Article[];
}

export interface Months {
  [key: string]: string;
}

export interface SrcObj {
  url: string;
  name: string;
  language: string;
}
