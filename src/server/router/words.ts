import express from 'express';
const router = express.Router();

import wordHandlers from '../handlers/words';

router.get('/define/:language/:phrase', wordHandlers.fetchPhraseDefinition);
router.post('/:language/:phrase', wordHandlers.savePhrase);
router.get('/:phrase', wordHandlers.fetchOnePhrase);
router.get('/', wordHandlers.fetchPhrases);

export default router;
