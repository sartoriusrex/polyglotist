import * as bcrypt from 'bcryptjs';

import db from './index';
import sources from '../crawler/all_sources';

const salt = 10;

interface Query {
  [key: string]: string;
}

const creationQueries: Query = {
  clean_database: `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS articles CASCADE;
    DROP TABLE IF EXISTS words CASCADE;
    DROP TABLE IF EXISTS sources CASCADE;
    DROP TABLE IF EXISTS users_words;
    DROP TABLE IF EXISTS users_sources;
    DROP TABLE IF EXISTS users_articles;
    DROP TABLE IF EXISTS article_bodies;
  `,

  // Create Tables: users, sources, articles, article_bodies, words, users_sources, users_articles, users_words,
  create_users_table: `
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
  `,
  create_sources_table: `
    CREATE TABLE sources (
      ID SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      language TEXT NOT NULL
    );
  `,
  create_articles_table: `
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
  `,
  create_article_bodies_table: `
    CREATE TABLE article_bodies (
      ID SERIAL PRIMARY KEY,
      article_id INT NOT NULL,
      tag_order INT NOT NULL,
      tag TEXT NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY (article_id) REFERENCES articles(id)
    );
  `,
  create_words_table: `
    CREATE TABLE words (
      ID SERIAL PRIMARY KEY,
      created TIMESTAMP DEFAULT NOW(),
      word TEXT NOT NULL,
      definition TEXT NOT NULL
    );
  `,
  create_users_words_table: `
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
  `,
  create_users_articles_table: `
    CREATE TABLE users_articles (
      ID SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      article_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (article_id) REFERENCES articles(id)
    );
  `,
  create_users_sources_table: `
    CREATE TABLE users_sources (
      ID SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      source_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (source_id) REFERENCES sources(id)
    );
  `,
};

// For testing, populate some initial data
const populate_users = `
  INSERT INTO users (username, email, password) VALUES
  ('username1', 'test1@test.com', $1),
  ('username2', 'test2@test.com', $2),
  ('username3', 'test3@test.com', $3);
`;

const populate_sources = `
  INSERT INTO sources (name, url, language) VALUES
  ($1, $2, $3) RETURNING id;
`;

const create_user_five = `
  INSERT INTO users (username, email, password, theme_preference, reading_speed, practice_mode, notification_method, languages_learning) VALUES ('username5', 'test5@test.com', $1, 'dark', 'fast', FALSE, 'push', ARRAY['spanish','french']);
`;

const add_users_five_sources = `
  INSERT INTO users_sources (user_id, source_id) VALUES
  ($1, $2);
`;

async function init() {
  const pw1 = await bcrypt.hash('password1', salt);
  const pw2 = await bcrypt.hash('password2', salt);
  const pw3 = await bcrypt.hash('password3', salt);
  const pw5 = await bcrypt.hash('password5', salt);

  try {
    console.log('\n=+=+ INITIALIZING DATABASE +=+=\n');

    for (let query in creationQueries) {
      await db.query(creationQueries[query]);
      console.log(`===// Called ${query} //===\n`);
    }

    // Populate Tables
    await db.query(populate_users, [pw1, pw2, pw3]);
    console.log('===// Populated Users. //===\n');

    await db.query(create_user_five, [pw5]);
    console.log('===// Created User 5. //===\n');

    // populate sources and return their ids to use in next population function
    let source_ids = await Promise.all(
      sources.map(
        async (source: { name: string; url: string; language: string }) => {
          let result = await db.query(populate_sources, [
            source.name,
            source.url,
            source.language,
          ]);
          return result.rows[0].id;
        }
      )
    );
    console.log('===// Populated Sources. //===\n');

    // Use source_ids in previous query and add them all to username5's sources in users_sources table
    await Promise.all(
      source_ids.map(async (id: string) => {
        await db.query(add_users_five_sources, [4, id]);
      })
    );
    console.log('===// Added sources for username5. //===\n');

    console.log(
      '=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+\n+=+ Successfully initialized db. +=+\n=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+\n'
    );
  } catch (err) {
    console.log(err);
  }
}

export default init;
