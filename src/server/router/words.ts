import express from 'express';
const router = express.Router();

import wordHandlers from '../handlers/words';

router.get('/:language/:phrase', wordHandlers.fetchPhraseDefinition);

export default router;
