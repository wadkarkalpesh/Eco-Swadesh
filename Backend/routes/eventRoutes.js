const express = require('express');
const router = express.Router();
const { streamEvents } = require('../services/eventStream');

router.get('/stream', streamEvents);

module.exports = router;
