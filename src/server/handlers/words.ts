import db from '../database';
import { Request, Response } from 'express';

export default {
  fetchPhraseDefinition: async (req: Request, res: Response) => {
    const { language, phrase } = req.params;
  },
};
