const express = require('express');
const router = express.Router();
const { getVoiceAdvisory } = require('../controllers/voiceController');

router.post('/voice-advisory', getVoiceAdvisory);

module.exports = router;
