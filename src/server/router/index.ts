import express from 'express';
const router = express.Router();

import userRoutes from './users';
import authRoutes from './auth';
import crawlerRoutes from './crawler';
import articleRoutes from './articles';
import wordRoutes from './words';

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/crawl', crawlerRoutes);
router.use('/articles', articleRoutes);
router.use('/words', wordRoutes);

export default router;
