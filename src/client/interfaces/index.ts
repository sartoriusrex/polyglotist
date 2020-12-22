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
  source: string;
}

export interface ArticleObject {
  source: Source;
  articles: Article[];
}

export type HighlightedPhrase = string;

export interface TranslationState {
  status: string;
  error: string;
  translation: string;
}

export type TranslationAction =
  | {
    type: 'fetching';
  }
  | {
    type: 'fetchError';
    error: string;
  }
  | {
    type: 'fetchSuccess';
    translation: string;
  };

export type SaveState = 'idle' | 'saving' | 'success' | 'error';

export interface IPhraseUnit {
  phrase_id: string;
  phrase: string;
  created_at: string;
  translation: string;
  language: string;
  article: string;
  context_phrase: string;
  strength: number;
}

export type LocationState = null | undefined | { phrase: IPhraseUnit; article?: Article } | { phrase?: IPhraseUnit; article: Article }

export type AuthNavProps = {
  user: { username: string };
  accountMenuOpen: boolean;
  setAccountMenuOpen: (value: boolean) => void;
};


export type NavbarProps = {
  accountMenuOpen?: boolean;
  setAccountMenuOpen?: (value: boolean) => void;
};