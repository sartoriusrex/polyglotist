import * as bcrypt from 'bcryptjs';

import db from './index';

const salt = 10;

const clean_database = `
  DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS articles CASCADE;
  DROP TABLE IF EXISTS words CASCADE;
  DROP TABLE IF EXISTS users_words;
  DROP TABLE IF EXISTS sources CASCADE;
  DROP TABLE IF EXISTS users_sources;
`;

const create_users = `
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

const create_sources = `
  CREATE TABLE sources (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    language TEXT NOT NULL
  );
`;

const populate_users = `
  INSERT INTO users (username, email, password) VALUES
  ('username1', 'test1@test.com', $1),
  ('username2', 'test2@test.com', $2),
  ('username3', 'test3@test.com', $3);
`;

const populate_sources = `
  INSERT INTO sources (name, url, language) VALUES
  ('twenty', 'https://www.20minutes.fr/', 'french'),
  ('monde', 'https://www.lemonde.fr/', 'french'),
  ('figaro', 'https://www.lefigaro.fr/', 'french'),
  ('parisien', 'http://www.leparisien.fr/', 'french'),
  ('abc', 'https://www.abc.es/', 'spanish'),
  ('bbc', 'https://www.bbc.com/mundo', 'spanish'),
  ('mundo', 'https://www.elmundo.es/', 'spanish'),
  ('pais', 'https://elpais.com/', 'spanish'),
  ('welt', 'https://www.welt.de/', 'german'),
  ('faz', 'https://www.faz.net/aktuell/', 'german'),
  ('sz', 'https://www.sueddeutsche.de/', 'german'),
  ('spiegel', 'https://www.spiegel.de/', 'german');
`;

const create_user_five = `
  INSERT INTO users (username, email, password, theme_preference, reading_speed, practice_mode, notification_method, languages_learning) VALUES ('username5', 'test5@test.com', $1, 'dark', 'fast', FALSE, 'push', ARRAY['spanish','french']);
`;

const update_user_five_settings = `
  INSERT INTO users_sources (user_id, source_id) VALUES
  (4, 1),
  (4, 3),
  (4, 5),
  (4, 6)
`;

const create_articles = `
  CREATE TABLE articles (
    ID SERIAL PRIMARY KEY,
    created TIMESTAMP DEFAULT NOW(),
    title TEXT NOT NULL,
    source_id INT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES sources(id)
  );
`;

const create_words = `
  CREATE TABLE words (
    ID SERIAL PRIMARY KEY,
    created TIMESTAMP DEFAULT NOW(),
    word TEXT NOT NULL,
    definition TEXT not null,
    article_id INT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id)
  );
`;

const create_users_words = `
  CREATE TABLE users_words (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (word_id) REFERENCES words(id)
  );
`;

const create_users_articles = `
  CREATE TABLE users_articles (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
  );
`;

const create_users_sources = `
  CREATE TABLE users_sources (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    source_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (source_id) REFERENCES sources(id)
  );
`;

async function init() {
  const pw1 = await bcrypt.hash('password1', salt);
  const pw2 = await bcrypt.hash('password2', salt);
  const pw3 = await bcrypt.hash('password3', salt);
  const pw5 = await bcrypt.hash('password5', salt);

  try {
    await db.query(clean_database);
    console.log('=======\nCleaned Database.\n=======\n');
    await db.query(create_users);
    console.log('=======\nCreated Users.\n=======\n');
    await db.query(create_sources);
    console.log('=======\nCreated sources.\n=======\n');
    await db.query(populate_users, [pw1, pw2, pw3]);
    console.log('=======\nPopulated Users.\n=======\n');
    await db.query(populate_sources);
    console.log('=======\nPopulated Users.\n=======\n');
    await db.query(create_user_five, [pw5]);
    console.log('=======\nCreated User 5.\n=======\n');
    await db.query(create_articles);
    console.log('=======\nCreated articles.\n=======\n');
    await db.query(create_words);
    console.log('=======\nCreated words.\n=======\n');
    await db.query(create_users_words);
    console.log('=======\nCreated users_words.\n=======\n');
    await db.query(create_users_sources);
    console.log('=======\nCreated users_sources.\n=======\n');
    await db.query(update_user_five_settings);
    console.log(
      '=======Updated username5"s settings to include sources.\n=======\n'
    );
    console.log('=======\nSuccessfully initialized db.\n=======\n');
  } catch (err) {
    console.log(err);
  }
}

export default init;
