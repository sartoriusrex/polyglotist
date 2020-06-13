import * as bcrypt from 'bcryptjs';

import db from './index';
import sources from '../crawler/all_sources';

const salt = 10;

const clean_database = `
  DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS articles CASCADE;
  DROP TABLE IF EXISTS words CASCADE;
  DROP TABLE IF EXISTS sources CASCADE;
  DROP TABLE IF EXISTS users_words;
  DROP TABLE IF EXISTS users_sources;
  DROP TABLE IF EXISTS users_articles;
  DROP TABLE IF EXISTS article_bodies;
`;

// Create Tables: users, sources, articles, article_bodies, words, users_sources, users_articles, users_words,
const create_users_table = `
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
`;

const create_sources_table = `
  CREATE TABLE sources (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    language TEXT NOT NULL
  );
`;

const create_articles_table = `
  CREATE TABLE articles (
    ID SERIAL PRIMARY KEY,
    scraped_date TIMESTAMP DEFAULT NOW(),
    article_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title TEXT NOT NULL,
    source_id INT NOT NULL,
    url TEXT NOT NULL,
    referenced BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (source_id) REFERENCES sources(id)
  );
`;

const create_article_bodies_table = `
  CREATE TABLE article_bodies (
    ID SERIAL PRIMARY KEY,
    article_id INT NOT NULL,
    tag_order INT NOT NULL,
    tag TEXT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id)
  );
`;

const create_words_table = `
  CREATE TABLE words (
    ID SERIAL PRIMARY KEY,
    created TIMESTAMP DEFAULT NOW(),
    word TEXT NOT NULL,
    definition TEXT NOT NULL
  );
`;

const create_users_words_table = `
  CREATE TABLE users_words (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    strength INT DEFAULT 0,
    article_id INT NOT NULL,
    context_sentence TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (word_id) REFERENCES words(id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
  );
`;

const create_users_articles_table = `
  CREATE TABLE users_articles (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
  );
`;

const create_users_sources_table = `
  CREATE TABLE users_sources (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    source_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (source_id) REFERENCES sources(id)
  );
`;

// For testing, populate some initial data
const populate_users = `
  INSERT INTO users (username, email, password) VALUES
  ('username1', 'test1@test.com', $1),
  ('username2', 'test2@test.com', $2),
  ('username3', 'test3@test.com', $3);
`;

const populate_sources = `
  INSERT INTO sources (name, url, language) VALUES
  ($1, $2, $3);
`;

const create_user_five = `
  INSERT INTO users (username, email, password, theme_preference, reading_speed, practice_mode, notification_method, languages_learning) VALUES ('username5', 'test5@test.com', $1, 'dark', 'fast', FALSE, 'push', ARRAY['spanish','french']);
`;

const update_user_five_settings = `
  INSERT INTO users_sources (user_id, source_id) VALUES
  (4, 1),
  (4, 2),
  (4, 3),
  (4, 5),
  (4, 8)
`;

async function init() {
  const pw1 = await bcrypt.hash('password1', salt);
  const pw2 = await bcrypt.hash('password2', salt);
  const pw3 = await bcrypt.hash('password3', salt);
  const pw5 = await bcrypt.hash('password5', salt);

  try {
    // Clean Database
    await db.query(clean_database);
    console.log('=======\nCleaned Database.\n=======\n');
    // Create Tables
    await db.query(create_users_table);
    console.log('=======\nCreated Users.\n=======\n');
    await db.query(create_sources_table);
    console.log('=======\nCreated sources.\n=======\n');
    await db.query(create_articles_table);
    console.log('=======\nCreated articles.\n=======\n');
    await db.query(create_article_bodies_table);
    console.log('=======\nCreated article bodies table.\n=======\n');
    await db.query(create_words_table);
    console.log('=======\nCreated words.\n=======\n');
    await db.query(create_users_articles_table);
    console.log('=======\nCreated users_articles.\n=======\n');
    await db.query(create_users_words_table);
    console.log('=======\nCreated users_words.\n=======\n');
    await db.query(create_users_sources_table);
    console.log('=======\nCreated users_sources.\n=======\n');

    // Populate Tables
    await db.query(populate_users, [pw1, pw2, pw3]);
    console.log('=======\nPopulated Users.\n=======\n');
    await Promise.all(
      sources.map(
        async (source: { name: string; url: string; language: string }) =>
          await db.query(populate_sources, [
            source.name,
            source.url,
            source.language,
          ])
      )
    );
    console.log('=======\nPopulated Sources.\n=======\n');
    await db.query(create_user_five, [pw5]);
    console.log('=======\nCreated User 5.\n=======\n');
    await db.query(update_user_five_settings);
    console.log('=======\nUpdated settings for username5.\n=======\n');
    console.log('=+=+=+=\nSuccessfully initialized db.\n=+=+=+=\n');
  } catch (err) {
    console.log(err);
  }
}

export default init;
