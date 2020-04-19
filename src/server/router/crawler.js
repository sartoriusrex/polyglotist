const router = require('express').Router();
const crawlHandlers = require('../handlers/crawlers');

router.post('/', crawlHandlers.crawlSource);

module.exports = router;