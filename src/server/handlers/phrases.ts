import db from '../database';
import { Request, Response } from 'express';
import { 
  insert_phrase,
  insert_users_articles,
  select_id_from_phrases_from_phrase_lang,
  select_id_from_users_articles_from_userid_article_id,
  select_id_from_users_from_username,
  select_id_ref_from_articles_from_url,
  update_article_reference_from_id,
  select_id_from_users_phrases_from_id,
  update_users_phrases,
  insert_user_phrase,
  select_all_from_phrases_from_id,
  select_all_from_users_phrases_from_userid,
  select_title_from_articles_from_id
} from '../queries';

import {
  Iphrase,
  IuPhraseRow
} from '../interfaces';

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
      const userResult = await db.query(
        select_id_from_users_from_username, 
        [username]
      );
      const userId = userResult.rows[0].id;

      // First, check if the article is referenced. If it isn't, update it to referenced true.

      const articleResult = await db.query(
        select_id_ref_from_articles_from_url, 
        [articleURL]
      );

      const { id: articleId, referenced } = articleResult.rows[0];

      if (referenced === false) {
        await db.query(
          update_article_reference_from_id, 
          [true,articleId]
        );
      }

      // Then check if relationship exists in users_articles. If not, create it. If creation goes wrong, make article reference change back if it was referenced false before. Send Error.

      const usersArticles = await db.query(
        select_id_from_users_articles_from_userid_article_id, 
        [userId,articleId]
      );
      const usersArticlesResult = usersArticles.rows;

      // The relationshp does not exist, so we create a new one
      if (
        usersArticlesResult.length === 0 ||
        !usersArticles ||
        !usersArticlesResult
      ) {
        try {
          await db.query(
            insert_users_articles,
            [userId, articleId]
          );
        } catch (err) {
          console.log('error creating user_article relationship', err);

          // We could not create the relationship, so if there was no relationship between the article and a user before, we set it back; otherwise we don't touch it.
          if (referenced === false) {
            await db.query(
              update_article_reference_from_id,
              [false, articleId]
            );
          }

          return res.status(500).send({ translationStatus: 'error' });
        }
      }

      // Then look up the phrase with its definition. If it exists, use that reference, otherwise, create it. If creating it goes wrong, just send the error.

      let phraseId;

      try {
        const phraseResult = await db.query(
          select_id_from_phrases_from_phrase_lang,
          [phrase, language]
        );

        if (phraseResult.rows.length > 0) {
          phraseId = phraseResult.rows[0].id;
        } else {
          // The phrase is not in the db, so we create it in the db
          try {
            const phraseCreationResult = await db.query(
              insert_phrase,
              [
                phrase,
                translation,
                language,
              ]
            );

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

      const findUsersPhrases = await db.query(
        select_id_from_users_phrases_from_id, 
        [userId, phraseId]
      );

      const foundUsersPhrases = findUsersPhrases.rows;

      // We found the relationship, so we update it
      if (foundUsersPhrases.length > 0) {
        try {
          await db.query(
            update_users_phrases,
            [1, articleId, context]
          );
        } catch (err) {
          console.log('error updating usersPhrases relationship', err);
          return res.status(500).send({ translationStatus: 'error' });
        }
      } else {
        // We did not find the relationship, so we create it
        try {
          await db.query(
            insert_user_phrase,
            [
              userId, 
              phraseId, 
              1, 
              articleId, 
              context
            ]
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
      const userPhraseResult = await db.query(
        select_all_from_users_phrases_from_userid, 
        [id]
      );
      const uPhraseRows = userPhraseResult.rows;

      const phrasesArray: Iphrase[] = await Promise.all(uPhraseRows.map(async (phraseRow: IuPhraseRow) => {
        const {
          phrase_id,
          article_id,
          strength,
          context_phrase
        } = phraseRow;

        const phraseResult = await db.query(
          select_all_from_phrases_from_id, 
          [phrase_id]
        );
        const articleResult = await db.query(
          select_title_from_articles_from_id, 
          [article_id]
        );

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
