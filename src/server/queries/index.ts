export const select_id_from_source = `
    SELECT id FROM sources WHERE name = $1;
`

export const insert_article = `
    INSERT INTO articles (title, article_date, source_id, url) VALUES
    ($1, $2, $3, $4) RETURNING id;
`

export const insert_article_bodies = `
    INSERT INTO article_bodies (article_id, tag_order, tag, text) VALUES
    ($1, $2, $3, $4);
`

// REMOVE ARTICLES THAT HAVE NOT BEEN SAVED AND HAVE NO REFERENCES AND WERE SCRAPED MORE THAN 12 HOURS AGO
export const delete_unused_articles = `
    DELETE FROM articles WHERE referenced = FALSE and AGE(NOW(), scraped_date) > '12 hours';
`
export const drop_all_tables = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS articles CASCADE;
    DROP TABLE IF EXISTS phrases CASCADE;
    DROP TABLE IF EXISTS sources CASCADE;
    DROP TABLE IF EXISTS users_phrases;
    DROP TABLE IF EXISTS users_sources;
    DROP TABLE IF EXISTS users_articles;
    DROP TABLE IF EXISTS article_bodies;
`

export const create_table_users = `
    CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    theme_preference TEXT DEFAULT 'light',
    reading_speed TEXT DEFAULT 'normal',
    practice_mode BOOLEAN DEFAULT TRUE,
    notification_method TEXT DEFAULT 'none',
    language_preference TEXT DEFAULT 'english',
    languages_learning TEXT[]
    );
`

export const create_table_sources = `
    CREATE TABLE sources (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    language TEXT NOT NULL
    );
`

export const create_table_articles = `
    CREATE TABLE articles (
    ID SERIAL PRIMARY KEY,
    scraped_date TIMESTAMP DEFAULT NOW(),
    article_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title TEXT NOT NULL,
    source_id INT NOT NULL,
    url TEXT NOT NULL,
    referenced BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
    );
`

export const create_table_article_bodies = `
    CREATE TABLE article_bodies (
    ID SERIAL PRIMARY KEY,
    article_id INT NOT NULL,
    tag_order INT NOT NULL,
    tag TEXT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );
`

export const create_table_phrases = `
    CREATE TABLE phrases (
    ID SERIAL PRIMARY KEY,
    created TIMESTAMP DEFAULT NOW(),
    phrase TEXT NOT NULL,
    translation TEXT NOT NULL,
    language TEXT NOT NULL
    );
`

export const create_table_users_phrases = `
    CREATE TABLE users_phrases (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    phrase_id INT NOT NULL,
    strength INT DEFAULT 0,
    article_id INT NOT NULL,
    context_phrase TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (phrase_id) REFERENCES phrases(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );
`

export const create_table_users_articles = `
    CREATE TABLE users_articles (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );
`

export const create_table_users_sources = `
    CREATE TABLE users_sources (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    source_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
    );
`
