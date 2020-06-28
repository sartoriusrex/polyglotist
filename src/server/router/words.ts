import express from 'express';
const router = express.Router();

import wordHandlers from '../handlers/words';

router.get('/:language/:phrase', wordHandlers.fetchPhraseDefinition);
router.post('/:language/:phrase', wordHandlers.savePhrase);

export default router;
