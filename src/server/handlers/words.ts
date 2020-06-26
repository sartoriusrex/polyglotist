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
    const languageCodes: { [language: string]: string } = {
      french: 'fr',
      spanish: 'es',
    };
    const langCode = languageCodes[language];

    try {
      let translatedText = await translateText(phrase, langCode);

      return res.status(200).send(translatedText);
    } catch (err) {
      console.log(err);

      const error = 'Failed to translate text with Google Translate';

      return res.status(502).send({ error });
    }
  },
};
