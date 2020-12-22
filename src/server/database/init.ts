import * as bcrypt from 'bcryptjs';

import db from './index';
import sources from '../crawler/all_sources';

import {
  drop_all_tables,
  create_table_users,
  create_table_sources,
  create_table_articles,
  create_table_article_bodies,
  create_table_phrases,
  create_table_users_phrases,
  create_table_users_articles,
  create_table_users_sources,
} from '../queries';

const salt = 10;

interface Query {
  [key: string]: string;
}

const creationQueries: Query = {
  clean_database: drop_all_tables,

  // Create Tables: users, sources, articles, article_bodies, phrases, users_sources, users_articles, users_phrases,
  create_users_table: create_table_users,
  create_sources_table: create_table_sources,
  create_articles_table: create_table_articles,
  create_article_bodies_table: create_table_article_bodies,
  create_phrases_table: create_table_phrases,
  create_users_phrases_table: create_table_users_phrases,
  create_users_articles_table: create_table_users_articles,
  create_users_sources_table: create_table_users_sources,
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
  try {
    console.log('\n=+=+ INITIALIZING DATABASE +=+=\n');

    for (let query in creationQueries) {
      await db.query(creationQueries[query]);
      console.log(`===// Called ${query} //===\n`);
    }

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

    console.log('\n\n',process.env.NODE_ENV, '\n\n');

    if( process.env.NODE_ENV === "development" ) {
      const pw1 = await bcrypt.hash('password1', salt);
      const pw2 = await bcrypt.hash('password2', salt);
      const pw3 = await bcrypt.hash('password3', salt);
      const pw5 = await bcrypt.hash('password5', salt);

      // Populate Tables
      await db.query(populate_users, [pw1, pw2, pw3]);
      console.log('===// Populated Users. //===\n');

      await db.query(create_user_five, [pw5]);
      console.log('===// Created User 5. //===\n');

      // Use source_ids in previous query and add them all to username5's sources in users_sources table
      await Promise.all(
        source_ids.map(async (id: string) => {
          await db.query(add_users_five_sources, [4, id]);
        })
      );
      console.log('===// Added sources for username5. //===\n');
    }

    console.log(
      '=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+\n+=+ Successfully initialized db. +=+\n=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+\n'
    );
  } catch (err) {
    console.log(err);
  }
}

export default init;
