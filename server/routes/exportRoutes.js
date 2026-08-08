const express = require('express');
const router = express.Router();
const {
  issueCertificate,
  getCertificateByNumber,
  runQuarantineCheck,
} = require('../controllers/exportController');
const { optionalJWT } = require('../middleware/auth');

router.post('/phytosanitary/issue', optionalJWT, issueCertificate);
router.get('/phytosanitary/:certNumber', getCertificateByNumber);
router.post('/quarantine-check', runQuarantineCheck);

module.exports = router;
