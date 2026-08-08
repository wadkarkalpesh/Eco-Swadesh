const express = require('express');
const router = express.Router();
const { sendCommand, getContainerStatus } = require('../controllers/actuatorController');
const { optionalJWT } = require('../middleware/auth');

router.post('/send-command', optionalJWT, sendCommand);
router.get('/:containerId/status', getContainerStatus);

module.exports = router;
