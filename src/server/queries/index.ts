export const select_id_from_users_from_username = `
    SELECT id 
    FROM users 
    WHERE username = $1;
`

export const select_email_from_users_from_email = `
    SELECT email 
    FROM users 
    WHERE email = $1;
`

export const select_all_from_all_users = `
    SELECT * 
    FROM users 
    ORDER BY username ASC;
`

export const select_all_from_users_from_username = `
    SELECT * 
    FROM users 
    WHERE username = $1;
`

export const select_user_from_username = `
    SELECT id, username, email, theme_preference, reading_speed, practice_mode, notification_method, language_preference, languages_learning 
    FROM users 
    WHERE username = $1;
`

export const select_all_from_user_from_username = `
    SELECT id, username, email, password, theme_preference, reading_speed, practice_mode, notification_method, language_preference, languages_learning 
    FROM users 
    WHERE username = $1;
`

export const select_id_from_source_from_name = `
    SELECT id 
    FROM sources 
    WHERE name = $1;
`

export const select_url_lang_from_source_from_name = `
    SELECT url, language 
    FROM sources 
    WHERE name = $1;
`

export const select_name_from_sources_from_id = `
    SELECT name 
    FROM sources 
    WHERE id = $1;
`

export const select_all_from_sources_from_id = `
    SELECT * 
    FROM sources 
    WHERE id = $1;
`

export const select_all_from_source_from_name = `
    SELECT * 
    FROM sources 
    WHERE name = $1;
`

export const select_id_ref_from_articles_from_url = `
    SELECT id, referenced 
    FROM articles 
    WHERE url = $1;
`

export const select_all_from_articles_from_id = `
    SELECT * 
    FROM articles 
    WHERE id = $1;
`

export const select_all_from_articles_from_title = `
    SELECT * 
    FROM articles 
    WHERE title = $1;
`

export const select_all_from_article_bodies_from_id = `
    SELECT tag, text 
    FROM article_bodies 
    WHERE article_id = $1 
    ORDER BY tag_order;
`

export const select_new_articles = `
    SELECT * 
    FROM articles 
    WHERE AGE(NOW(), scraped_date) < '12 hours' AND source_id = $1;
`

export const select_all_from_users_articles_from_user_id = `
    SELECT * 
    FROM users_articles 
    WHERE user_id = $1;
`

export const select_id_from_users_articles_from_userid_article_id = `
    SELECT id 
    FROM users_articles 
    WHERE user_id = $1 AND article_id = $2;
`

export const select_all_from_users_articles_from_user_and_article_id = `
    SELECT * 
    FROM users_articles 
    WHERE user_id = $1 AND article_id = $2;
`

export const select_sourceid_from_users_sources_from_userid = `
    SELECT source_id 
    FROM users_sources 
    WHERE user_id = $1 
    ORDER BY source_id ASC;
`

export const select_id_from_phrases_from_phrase_lang = `
    SELECT id 
    FROM phrases 
    WHERE phrase = $1 AND language = $2;
`

export const select_id_from_users_phrases_from_id = `
    SELECT id 
    FROM users_phrases 
    WHERE user_id = $1 AND phrase_id = $2;
`

export const select_all_from_phrases_from_id = `
    SELECT * 
    FROM phrases 
    WHERE id = $1;
`

export const select_all_from_users_phrases_from_userid = `
    SELECT * 
    FROM users_phrases 
    WHERE user_id = $1;
`

export const select_practice_from_users_phrases_from_userid = `
    SELECT
        phrases.created as created_at,
        phrase_id,
        last_practiced,
        strength,
        article_id,
        context_phrase,
        phrase,
        translation,
        language,
        articles.title as article
    FROM users_phrases
    LEFT JOIN phrases 
        ON phrases.ID = users_phrases.phrase_id
    LEFT JOIN articles
        ON articles.ID = users_phrases.article_id
    WHERE users_phrases.user_id = $1 AND phrases.language = $2
    ORDER BY strength ASC, last_practiced ASC
    LIMIT $3;
`

export const select_all_from_users_phrases_from_userid_and_phrase_id = `
    SELECT
        user_id,
        phrase_id,
        strength,
        strikes,
        last_practiced
    FROM users_phrases
    WHERE user_id = $1 AND phrase_id = $2;
`

export const select_title_from_articles_from_id = `
    SELECT title 
    FROM articles 
    WHERE id = $1;
`

export const insert_user = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, reading_speed, theme_preference, practice_mode, notification_method, language_preference, languages_learning;
`

export const insert_article = `
    INSERT INTO articles (title, article_date, source_id, url) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id;
`

export const insert_article_bodies = `
    INSERT INTO article_bodies (article_id, tag_order, tag, text) 
    VALUES ($1, $2, $3, $4);
`

export const insert_users_articles = `
    INSERT INTO users_articles (user_id, article_id) 
    VALUES ($1, $2) 
    RETURNING id;
`

export const insert_user_sources = `
    INSERT INTO users_sources (user_id, source_id) 
    VALUES ($1, $2) 
    RETURNING source_id;
`

export const insert_phrase = `
    INSERT INTO phrases (phrase, translation, language) 
    VALUES ($1, $2, $3) 
    RETURNING id;
`

export const insert_user_phrase = `
    INSERT INTO users_phrases (user_id, phrase_id, strength, article_id, context_phrase) 
    VALUES ($1, $2, $3, $4, $5);
`

// REMOVE ARTICLES THAT HAVE NOT BEEN SAVED AND HAVE NO REFERENCES AND WERE SCRAPED MORE THAN 12 HOURS AGO
export const delete_unused_articles = `
    DELETE FROM articles 
    WHERE referenced = FALSE and AGE(NOW(), scraped_date) > '12 hours';
`

export const delete_user_source = `
    DELETE FROM users_sources 
    WHERE user_id = $1;
`

export const delete_user = `
    DELETE FROM users 
    WHERE username = $1;
`

export const update_username = `
    UPDATE users 
    SET username = $1 
    WHERE username = $2 
    RETURNING username;
`

export const update_email = `
    UPDATE users 
    SET email = $1 
    WHERE username = $2 
    RETURNING email;
`

export const update_password = `
    UPDATE users 
    SET password = $1 
    WHERE username = $2 
    RETURNING password;
`

export const update_user_settings = `
    UPDATE users 
    SET reading_speed = $1, theme_preference = $2, practice_mode = $3, notification_method = $4, language_preference = $5, languages_learning = $6 
    WHERE username = $7 RETURNING id, reading_speed, theme_preference, practice_mode, notification_method, language_preference, languages_learning;
`

export const update_article_reference_from_id = `
    UPDATE articles 
    SET referenced = $1 
    WHERE id = $2 
    RETURNING id;
`

export const update_users_phrases = `
    UPDATE users_phrases 
    SET strength = $1, article_id = $2, context_phrase = $3;
`

export const update_phrase_strength = `
    UPDATE users_phrases
    WHERE user_id = $1 AND phrase_id = $2
    SET strength = $3, last_practiced = $4, strikes = $5;
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
    last_practiced TIMESTAMP DEFAULT NOW(),
    strength INT DEFAULT 0,
    strikes INT DEFAULT 0,
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
