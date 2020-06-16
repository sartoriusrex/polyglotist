import express from 'express';
const router = express.Router();

import articleHandlers from '../handlers/articles';

router.get('/fresh_articles', articleHandlers.fetchFreshArticles);
router.get('/user_articles', articleHandlers.fetchArticles);
router.get('/user_one_article', articleHandlers.fetchOneArticle);

export default router;
