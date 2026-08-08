const express = require('express');
const router = express.Router();
const {
  verifyQRSeal,
  getCertifications,
  uploadCertificate,
  moderateCertificate,
} = require('../controllers/trustController');
const { optionalJWT, requireRole } = require('../middleware/auth');

router.get('/qr/:sealCode', optionalJWT, verifyQRSeal);
router.get('/certifications', optionalJWT, getCertifications);
router.post('/upload-certificate', optionalJWT, uploadCertificate);
router.put('/moderate/:certId', optionalJWT, moderateCertificate);

module.exports = router;
