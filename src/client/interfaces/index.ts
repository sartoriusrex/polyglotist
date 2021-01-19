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

export interface settingsStateInterface {
  loading: boolean;
  hasErrors: boolean;
  themePreference: string;
  readingSpeed: string;
  practiceMode: boolean;
  notificationMethod: string;
  languagePreference: string;
  languagesLearning: string[] | null;
  sources: string[];
}


export interface phraseInterface {
  phrase_id: string;
  created_at: string;
  phrase: string;
  translation: string;
  language: string;
  article: string;
  context_phrase: string;
  strength: number;
}

export interface phrasesStateInterface {
  loading: boolean;
  hasErrors: boolean;
  phrases: phraseInterface[] | [];
}

export interface phraseResult {
  phrase: phraseInterface;
  change: 1 | -1 | 0;
  result: 1 | -1;
}

export interface practiceStateInterface {
  loadingQuestions: boolean;
  loadingResults: boolean;
  questionsHasErrors: boolean;
  resultsHasErrors: boolean;
  phrases: phraseInterface[];
  results: phraseResult[];
}

export interface userStateInterface {
  loading: boolean;
  hasErrors: boolean;
  users: any[];
}


export interface authStateInterface {
  loading: boolean;
  hasErrors: boolean;
  user: any;
}

export interface messageStateInterface {
  message: string | null;
}

interface DatabaseSource {
  name: string;
  url: string;
  language: string;
  error?: string;
}

interface CrawlResult {
  title: string;
  date: string;
  url: string;
  language: string;
  body: string[][];
  error?: string;
}

interface SourceText {
  source: DatabaseSource;
  articles?: CrawlResult[] | { error: string };
  error?: string;
}

export interface newArticlesStateInterface {
  loading: boolean;
  hasErrors: boolean;
  articles: SourceText[] | null;
}


export interface ArticlesStateInterface {
  loading: boolean;
  hasErrors: boolean;
  articles: Article[] | [];
  // Need to add date and date read in state, as well as update backend to get this data
}