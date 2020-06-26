import db from '../database';
import { Request, Response } from 'express';

export default {
  fetchPhraseDefinition: async (req: Request, res: Response) => {
    const { language, phrase } = req.params;

    let error = 'testing error';

    let definitionObject = { language, phrase };

    // res.status(400).send({ error });
    res.status(200).send(definitionObject);
  },
};
