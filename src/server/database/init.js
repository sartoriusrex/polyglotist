const bcrypt = require('bcryptjs');

const db = require('./index');

const salt = 10;

const clean_database = `
  DROP TABLE IF EXISTS users;
`;

const create_users = `
  CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    theme_preference TEXT DEFAULT 'light',
    reading_speed TEXT DEFAULT 'normal',
    notifications BOOLEAN DEFAULT TRUE
  );
`;

const populate_users = `
  INSERT INTO users (name, email, password) VALUES
  ('username1', 'test1@test.com', $1),
  ('username2', 'test2@test.com', $2),
  ('username3', 'test3@test.com', $3);
`;

async function init() {
  const pw1 = await bcrypt.hash('password1', salt);
  const pw2 = await bcrypt.hash('password2', salt);
  const pw3 = await bcrypt.hash('password3', salt);
  
  try {
    await db.query(clean_database);
    await db.query(create_users);
    await db.query(populate_users, [pw1,pw2,pw3]);
    console.log('\n=======\nSuccessfully initialized db.\n=======\n');
  } catch (err) {
    console.log(err)
  }
}

module.exports = init;
