import express from 'express';
const router = express.Router();

import userRoutes from './users';
import authRoutes from './auth';
import crawlerRoutes from './crawler';

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/crawl', crawlerRoutes);

export default router;
