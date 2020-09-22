import express from 'express';
const router = express.Router();

import articleHandlers from '../handlers/articles';

router.post('/fresh_articles', articleHandlers.fetchFreshArticles);
router.post('/', articleHandlers.fetchArticles);
router.post('/user_one_article', articleHandlers.fetchOneArticle);

export default router;
