import express from 'express';
const router = express.Router();

import phraseHandlers from '../handlers/phrases';

router.get('/define/:language/:phrase', phraseHandlers.fetchPhraseDefinition);
router.post('/:language/:phrase', phraseHandlers.savePhrase);
router.get('/:phrase', phraseHandlers.fetchOnePhrase);
router.post('/', phraseHandlers.fetchPhrases);

export default router;
