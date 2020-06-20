export interface sourceArrayInterface {
  name: string;
  id: string;
  desc: string;
}

export interface Source {
  name: string;
  url: string;
  language: string;
  id?: string;
}

export interface Article {
  title: string;
  date: string;
  url: string;
  language: string;
  body: string[][];
}

export interface ArticleObject {
  source: Source;
  articles: Article[];
}
