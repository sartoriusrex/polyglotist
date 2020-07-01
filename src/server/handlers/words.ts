import db from '../database';
import { Request, Response } from 'express';

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

    try {
      // First, check if the article is referenced. If it isn't, update it to referenced true.

      const userIdQuery = `SELECT id FROM users WHERE username = $1`;

      const articleQuery = `SELECT id, referenced FROM articles WHERE url = $1;`;

      const updateArticleReferenced = `UPDATE articles SET referenced = $1 WHERE id = $2 RETURNING id;`;

      const userResult = await db.query(userIdQuery, [username]);
      const userId = userResult.rows[0].id;

      const articleResult = await db.query(articleQuery, [articleURL]);
      const articleId = articleResult.rows[0].id;
      const referenced = articleResult.rows[0].referenced;

      if (referenced === false) {
        const updatedArticle = await db.query(updateArticleReferenced, [
          true,
          articleId,
        ]);
      }

      // Then check if relationship exists in users_articles. Reference that if it exists. Otherwise, create it. If creation goes wrong, make article reference change back if it was referenced false before. Send Error.
      const usersArticlesQuery = `
        SELECT id FROM users_articles WHERE user_id = $1 AND article_id = $2;
      `;

      const createUsersArticlesQuery = `
        INSERT INTO users_articles (user_id, article_id) VALUES
        $1, $2 RETURNING id;
      `;

      const usersArticles = await db.query(usersArticlesQuery, [
        userId,
        articleId,
      ]);

      const usersArticlesResult = usersArticles.rows;

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
        const phraseQuery = `SELECT id FROM phrases WHERE phrase = $1 AND language = $2;`;

        const createPhraseQuery = `INSERT INTO phrases (phrase, translation, language) VALUES $1, $2, $3 RETURNING id`;

        const phraseResult = await db.query(phraseQuery, [phrase, language]);

        phraseId = phraseResult.rows[0].id;

        if (!phraseId || phraseId === null) {
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
      const usersPhrasesQuery = `SELECT id FROM users_phrases WHERE user_id = $1 AND phrase_id = $2;`;

      const usersPhrasesUpdateQuery = `UPDATE users_phrases SET strength = $1, article_id = $2, context_phrase = $3;`;

      const usersPhrasesCreateQuery = `INSERT INTO users_phrases (user_id, phrase_id, strength, article_id, context_phrase) VALUES $1, $2, $3, $4, $5;`;

      const findUsersPhrases = await db.query(usersPhrasesQuery, [userId, phraseId]);

      const foundUsersPhrases = findUsersPhrases.rows[0];

      if (foundUsersPhrases !== null) {
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
    } catch (err) {
      console.log(err);
      return res.status(500).send({ translationStatus: 'error' });
    }
  },
};
