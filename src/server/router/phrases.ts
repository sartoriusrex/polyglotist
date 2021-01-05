import express from 'express';
const router = express.Router();

import phraseHandlers from '../handlers/phrases';

// full router starts with /api/phrases/

router.get('/define/:language/:phrase', phraseHandlers.fetchPhraseDefinition);
router.get('/practice/:language/:mode/:userId', phraseHandlers.fetchPracticePhrases);
router.post('/:language/:phrase', phraseHandlers.savePhrase);
router.patch('/:phraseId', phraseHandlers.updateOnePhrase);
router.get('/:phrase', phraseHandlers.fetchOnePhrase);
router.post('/', phraseHandlers.fetchPhrases);

export default router;
