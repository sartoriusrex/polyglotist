const router = require('express').Router();
const userRoutes = require('./users');
const authRoutes = require('./auth');
const crawlerRoutes = require('./crawler');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/crawl', crawlerRoutes);

module.exports = router;
