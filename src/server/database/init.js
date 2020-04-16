const bcrypt = require('bcryptjs');

const db = require('./index');

const salt = 10;

const clean_database = `
  DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS articles CASCADE;
  DROP TABLE IF EXISTS words CASCADE;
  DROP TABLE IF EXISTS users_words;
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

const populate_users = `
  INSERT INTO users (username, email, password) VALUES
  ('username1', 'test1@test.com', $1),
  ('username2', 'test2@test.com', $2),
  ('username3', 'test3@test.com', $3);
`;

const create_user_five = `
  INSERT INTO users (username, email, password, theme_preference, reading_speed, practice_mode, notification_method, languages_learning) VALUES ('username5', 'test5@test.com', $1, 'dark', 'fast', FALSE, 'push', ARRAY['spanish','french']);
`

const create_articles = `
  CREATE TABLE articles (
    ID SERIAL PRIMARY KEY,
    created TIMESTAMP DEFAULT NOW(),
    title TEXT NOT NULL,
    link TEXT NOT NULL
  );
`

const create_words = `
  CREATE TABLE words (
    ID SERIAL PRIMARY KEY,
    created TIMESTAMP DEFAULT NOW(),
    word TEXT NOT NULL,
    definition TEXT not null,
    article_id INT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id)
  );
`

const create_users_words = `
  CREATE TABLE users_words (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (word_id) REFERENCES words(id)
  );
`

const create_users_articles = `
  CREATE TABLE users_articles (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
  )
`

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
    await db.query(populate_users, [pw1,pw2,pw3]);
    console.log('=======\nPopulated Users.\n=======\n');
    await db.query(create_user_five, [pw5]);
    console.log('=======\nCreated User 5.\n=======\n');
    await db.query(create_articles);
    console.log('=======\nCreated articles.\n=======\n');
    await db.query(create_words);
    console.log('=======\nCreated words.\n=======\n');
    await db.query(create_users_words);
    console.log('=======\nCreated users_words.\n=======\n');
    console.log('=======\nSuccessfully initialized db.\n=======\n');
  } catch (err) {
    console.log(err)
  }
}

module.exports = init;
