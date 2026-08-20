const express = require('express');
const router = express.Router();
const {
  verifyQRSeal,
  getCertifications,
  uploadCertificate,
  decideCertification,
  checkCertExpiry,
} = require('../controllers/trustController');
const { optionalJWT, authenticateJWT } = require('../middleware/auth');

router.get('/qr/:sealCode', optionalJWT, verifyQRSeal);
router.get('/certifications', optionalJWT, getCertifications);
router.post('/upload-certificate', optionalJWT, uploadCertificate);
router.post('/decide-certification', authenticateJWT, decideCertification);
router.put('/moderate/:certId', optionalJWT, decideCertification);
router.get('/check-expiry', optionalJWT, checkCertExpiry);

module.exports = router;
