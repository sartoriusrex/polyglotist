const bcrypt = require('bcryptjs');

const db = require('./index');

const salt = 10;

const clean_database = `
  DROP TABLE IF EXISTS users;
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
    notifications BOOLEAN DEFAULT TRUE,
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
  INSERT INTO users (username, email, password, theme_preference, reading_speed, practice_mode, notifications, notification_method, languages_learning) VALUES ('username5', 'test5@test.com', $1, 'dark', 'fast', FALSE, FALSE, 'push', ARRAY['spanish','french']);
`

async function init() {
  const pw1 = await bcrypt.hash('password1', salt);
  const pw2 = await bcrypt.hash('password2', salt);
  const pw3 = await bcrypt.hash('password3', salt);
  const pw5 = await bcrypt.hash('password5', salt);
  
  try {
    await db.query(clean_database);
    await db.query(create_users);
    await db.query(populate_users, [pw1,pw2,pw3]);
    await db.query(create_user_five, [pw5]);
    console.log('\n=======\nSuccessfully initialized db.\n=======\n');
  } catch (err) {
    console.log(err)
  }
}

module.exports = init;
