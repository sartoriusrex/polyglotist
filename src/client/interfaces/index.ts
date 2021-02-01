export interface SourceArray {
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
  read?: string;
  url: string;
  language: string;
  body: string[][];
  source: string;
}

export interface AO {
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

export type SaveState = 
  'idle' | 
  'saving' | 
  'success' | 
  'error';


export interface Phrase {
  phrase_id: string;
  created_at: string;
  last_practiced: string;
  phrase: string;
  translation: string;
  language: string;
  article: string;
  context_phrase: string;
  strength: number;
}

export interface PhraseUnit extends Phrase {
  phrase_id: string;
}

export type LocationState = 
  null |
  undefined | 
  { phrase: PhraseUnit; article?: Article } | 
  { phrase?: PhraseUnit; article: Article }

export type AuthNavProps = {
  user: { username: string };
  accountMenuOpen: boolean;
  setAccountMenuOpen: (value: boolean) => void;
};


export type NavbarProps = {
  accountMenuOpen?: boolean;
  setAccountMenuOpen?: (value: boolean) => void;
};

export interface SettingsState {
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

export interface PhrasesState {
  loading: boolean;
  hasErrors: boolean;
  phrases: Phrase[] | [];
}

export interface PhraseResult {
  phrase: Phrase;
  change: 1 | -1 | 0;
  result: 1 | -1;
}

export interface PracticeState {
  loadingQuestions: boolean;
  loadingResults: boolean;
  questionsHasErrors: boolean;
  resultsHasErrors: boolean;
  phrases: Phrase[];
  results: PhraseResult[];
}

export interface UserState {
  loading: boolean;
  hasErrors: boolean;
  users: any[];
}


export interface AuthState {
  loading: boolean;
  hasErrors: boolean;
  user: any;
}

export interface MessageState {
  message: string | null;
}

export interface NewArticlesState {
  loading: boolean;
  hasErrors: boolean;
  articles: Article[] | null;
}


export interface ArticlesState {
  loading: boolean;
  hasErrors: boolean;
  articles: Article[] | [];
  // Need to add date and date read in state,
  //as well as update backend to get this data
}