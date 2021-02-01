export interface Phrase {
    phrase_id: number;
    created_at: string;
    phrase: string;
    translation: string;
    language: string;
    article: string;
    context_phrase: string;
    strength: number;
}

export interface PhraseRow {
    id: number;
    user_id: number;
    phrase_id: number;
    strength: number;
    article_id: number;
    context_phrase: string;
    last_practiced: string;
}

export interface UsersArticles {
    id: number;
    user_id: number;
    article_id: number;
    created: string;
}

export interface Article {
    title: string;
    date: string;
    url: string;
    language: string;
    body: string[][];
    source: string;
}