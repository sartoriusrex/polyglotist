import express from 'express';
const router = express.Router();

import * as userRoutes from './users';
import * as authRoutes from './auth';
import * as crawlerRoutes from './crawler';

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/crawl', crawlerRoutes);

export default router;
