export interface DatabaseSource {
  name: string;
  url: string;
  language: string;
  error?: string;
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
  articles?: CrawlResult[] | { error: string };
  error?: string;
}
