import express from 'express';
const router = express.Router();
import crawlHandlers from '../handlers/crawlers';

router.post('/', crawlHandlers.crawlSources);

export default router;
