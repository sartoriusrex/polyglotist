import db from '../database';
import { Request, Response } from 'express';
import { createDispatchHook } from 'react-redux';

const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate();

async function translateText(text: string, target: string) {
  let [translation] = await translate.translate(text, target);

  return translation;
}

export default {
  fetchPhraseDefinition: async (req: Request, res: Response) => {
    const { language, phrase } = req.params;
    // const key = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    // const languageCodes: { [language: string]: string } = {
    //   french: 'fr',
    //   spanish: 'es',
    // };
    // const langCode = languageCodes[language];

    try {
      let translatedText = await translateText(phrase, 'en');

      return res.status(200).send({ translation: translatedText });
    } catch (err) {
      console.log(err);

      const error = 'Failed to translate text with Google Translate';

      return res.status(502).send({ error });
    }
  },
  savePhrase: async (req: Request, res: Response) => {
    const username: string = req.body.username;
    const articleURL: string = req.body.articleURL;
    const translation: string = req.body.translation;
    const context: string = req.body.context;
    const language: string = req.params.language;
    const phrase: string = req.params.phrase;

    // All our SQL queries here to facilitate code readability
    const userIdQuery = `SELECT id FROM users WHERE username = $1`;
    const articleQuery = `SELECT id, referenced FROM articles WHERE url = $1;`;
    const updateArticleReferenced = `UPDATE articles SET referenced = $1 WHERE id = $2 RETURNING id;`;
    const usersArticlesQuery = `SELECT id FROM users_articles WHERE user_id = $1 AND article_id = $2;`;
    const createUsersArticlesQuery = `INSERT INTO users_articles (user_id, article_id) VALUES ($1, $2) RETURNING id;`;
    const phraseQuery = `SELECT id FROM phrases WHERE phrase = $1 AND language = $2;`;
    const createPhraseQuery = `INSERT INTO phrases (phrase, translation, language) VALUES ($1, $2, $3) RETURNING id`;
    const usersPhrasesQuery = `SELECT id FROM users_phrases WHERE user_id = $1 AND phrase_id = $2;`;
    const usersPhrasesUpdateQuery = `UPDATE users_phrases SET strength = $1, article_id = $2, context_phrase = $3;`;
    const usersPhrasesCreateQuery = `INSERT INTO users_phrases (user_id, phrase_id, strength, article_id, context_phrase) VALUES ($1, $2, $3, $4, $5);`;

    try {
      const userResult = await db.query(userIdQuery, [username]);
      const userId = userResult.rows[0].id;

      // First, check if the article is referenced. If it isn't, update it to referenced true.

      const articleResult = await db.query(articleQuery, [articleURL]);
      const articleId = articleResult.rows[0].id;
      const referenced = articleResult.rows[0].referenced;

      if (referenced === false) {
        const updatedArticle = await db.query(updateArticleReferenced, [
          true,
          articleId,
        ]);
      }

      // Then check if relationship exists in users_articles. If not, create it. If creation goes wrong, make article reference change back if it was referenced false before. Send Error.

      const usersArticles = await db.query(usersArticlesQuery, [
        userId,
        articleId,
      ]);
      const usersArticlesResult = usersArticles.rows;

      // The relationshp does not exist, so we create a new one
      if (
        usersArticlesResult.length === 0 ||
        !usersArticles ||
        !usersArticlesResult
      ) {
        try {
          const newUsersArticlesRelationship = await db.query(
            createUsersArticlesQuery,
            [userId, articleId]
          );
        } catch (err) {
          console.log('error creating user_article relationship', err);

          // We could not create the relationship, so if there was no relationship between the article and a user before, we set it back; otherwise we don't touch it.
          if (referenced === false) {
            const revertReference = await db.query(updateArticleReferenced, [
              false,
              articleId,
            ]);
          }

          return res.status(500).send({ translationStatus: 'error' });
        }
      }

      // Then look up the phrase with its definition. If it exists, use that reference, otherwise, create it. If creating it goes wrong, just send the error.

      let phraseId;

      try {
        const phraseResult = await db.query(phraseQuery, [phrase, language]);

        if (phraseResult.rows.length > 0) {
          phraseId = phraseResult.rows[0].id;
        } else {
          // The phrase is not in the db, so we create it in the db
          try {
            const phraseCreationResult = await db.query(createPhraseQuery, [
              phrase,
              translation,
              language,
            ]);

            phraseId = phraseCreationResult.rows[0].id;
          } catch (err) {
            console.log('error creating phrase', err);
            return res.status(500).send({ translationStatus: 'error' });
          }
        }
      } catch (err) {
        console.log('error looking up creating a phrase in db', err);
        return res.status(500).send({ translationStatus: 'error' });
      }

      // Then check to see if the users_phrases relationship exists between the phrase and user. If it does, we need to UPDATE the relationship: decrease strength by 1, update article_id, and update context_phrase. If the update goes wrong, just send the error.
      // If that relatinoshp does not exist, create it. If that goes wrong, just send the error.

      const findUsersPhrases = await db.query(usersPhrasesQuery, [
        userId,
        phraseId,
      ]);

      const foundUsersPhrases = findUsersPhrases.rows;

      // We found the relationship, so we update it
      if (foundUsersPhrases.length > 0) {
        try {
          const updateUsersPhrasesRelationship = await db.query(
            usersPhrasesUpdateQuery,
            [1, articleId, context]
          );
        } catch (err) {
          console.log('error updating usersPhrases relationship', err);
          return res.status(500).send({ translationStatus: 'error' });
        }
      } else {
        // We did not find the relationship, so we create it
        try {
          const createUsersPhrasesRelationship = await db.query(
            usersPhrasesCreateQuery,
            [userId, phraseId, 1, articleId, context]
          );
        } catch (err) {
          console.log('error creating usersPhrases relationship', err);
          return res.status(500).send({ translationStatus: 'error' });
        }
      }

      return res.status(200).send({ translationStatus: 'success' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ translationStatus: 'error' });
    }
  },
  fetchOnePhrase: async (req: Request, res: Response) => {
    console.log('get one phrase');
  },
  fetchPhrases: async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
      const phraseQuery = `SELECT * FROM phrases WHERE id = $1`;
      const usersPhraseQuery = `SELECT * FROM users_phrases WHERE user_id = $1`;
      const articleQuery = `SELECT title FROM articles WHERE id = $1`;

      const userPhraseResult = await db.query(usersPhraseQuery, [id]);
      const uPhraseRows = userPhraseResult.rows;

      interface IuPhraseRow {
        id: Number;
        user_id: Number;
        phrase_id: Number;
        strength: Number;
        article_id: Number;
        context_phrase: String;
      }

      interface Iphrase {
        phrase_id: Number;
        created_at: String;
        phrase: String;
        translation: String;
        language: String;
        article: String;
        context_phrase: String;
        strength: Number;
      }

      const phrasesArray: Iphrase[] = await Promise.all(uPhraseRows.map(async (phraseRow: IuPhraseRow) => {
        const {
          phrase_id,
          article_id,
          strength,
          context_phrase
        } = phraseRow;

        const phraseResult = await db.query(phraseQuery, [phrase_id]);
        const articleResult = await db.query(articleQuery, [article_id]);

        const {
          created,
          phrase,
          translation,
          language
        } = phraseResult.rows[0];
        const { title } = articleResult.rows[0]

        return {
          phrase_id,
          created_at: created,
          phrase,
          translation,
          language,
          article: title,
          context_phrase,
          strength,
        }
      }));

      return res.status(200).send(phrasesArray);
    } catch (err) {
      console.log(err);

      res.status(500).send({ error: err })
    }
  },
};
