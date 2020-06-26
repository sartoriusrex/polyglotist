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

export type HighlightedPhrase = null | string;

export interface DefinitionState {
  fetching: boolean;
  error: string;
  definitionObject: {};
}

export type DefinitionAction =
  | {
      type: 'fetching';
    }
  | {
      type: 'fetchError';
      error: string;
    }
  | {
      type: 'fetchSuccess';
      definitionObject: { language?: string; phrase?: string };
    };
