export interface Iphrase {
    phrase_id: Number;
    created_at: String;
    phrase: String;
    translation: String;
    language: String;
    article: String;
    context_phrase: String;
    strength: Number;
}

export interface IuPhraseRow {
    id: Number;
    user_id: Number;
    phrase_id: Number;
    strength: Number;
    article_id: Number;
    context_phrase: String;
    last_practiced: string;
}

export interface IUsersArticles {
    id: Number;
    user_id: Number;
    article_id: Number;
}