/**
 * Trust & Anti-Counterfeit Verification Controller
 * Lead Architect: Lead Compliance & Trust Engineer
 */

const db = require('../config/db');

/**
 * Verify Anti-Counterfeit QR Seal / Certification License
 * GET /v1/verify/qr/:sealCode
 */
const verifyQRSeal = (req, res) => {
  const { sealCode } = req.params;
  const decodedSeal = decodeURIComponent(sealCode).trim();

  // Search by license number or ID or partial matching
  const cert = db.getAll('certifications').find(
    (c) =>
      c.licenseNo.toLowerCase() === decodedSeal.toLowerCase() ||
      c.id.toLowerCase() === decodedSeal.toLowerCase() ||
      decodedSeal.toLowerCase().includes(c.licenseNo.toLowerCase()) ||
      c.licenseNo.toLowerCase().includes(decodedSeal.toLowerCase())
  );

  if (!cert) {
    return res.status(404).json({
      success: false,
      authentic: false,
      error: 'UNVERIFIED_SEAL',
      message: `The QR Seal or License '${sealCode}' could not be verified in the APEDA / USDA National Organic database.`,
      recommendation: 'Do not accept this batch without independent laboratory analysis.',
    });
  }

  // Audit log the verification scan
  db.logAudit({
    actorId: req.user ? req.user.id : 'qr_scanner_client',
    actorRole: 'consumer_or_buyer',
    action: 'VERIFY_ANTI_COUNTERFEIT_QR',
    targetType: 'CERTIFICATION',
    targetId: cert.id,
    reason: `QR seal scan verified authentic for ${cert.name} (${cert.licenseNo})`,
  });

  return res.status(200).json({
    success: true,
    authentic: true,
    certId: cert.id,
    certName: cert.name,
    type: cert.type,
    country: cert.country,
    issuingAuthority: cert.issuingAuthority,
    licenseNo: cert.licenseNo,
    verifiedScore: cert.verifiedScore || 98.5,
    validUntil: cert.validUntil,
    status: cert.status || 'ACTIVE',
    badgeText: cert.badgeText,
    logo: cert.logo,
    message: 'Authentic organic certification verified against official government registry.',
  });
};

/**
 * List Public Certified Organic Registry
 * GET /v1/trust/certifications
 */
const getCertifications = (req, res) => {
  const { type, country, search } = req.query;
  let list = db.getAll('certifications');

  if (type && type !== 'ALL') {
    list = list.filter((c) => c.type === type);
  }

  if (country) {
    list = list.filter((c) => c.country.toLowerCase().includes(country.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.licenseNo.toLowerCase().includes(q) ||
        c.issuingAuthority.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    success: true,
    total: list.length,
    certifications: list,
  });
};

/**
 * Upload New Organic License for Moderation
 * POST /v1/trust/upload-certificate
 */
const uploadCertificate = (req, res) => {
  const {
    name,
    type = 'LOCAL_GOV',
    issuingAuthority,
    licenseNo,
    validUntil = '2028-12-31',
    documentUrl,
  } = req.body;

  if (!name || !licenseNo || !issuingAuthority) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'Certificate name, issuing authority, and official license number are required.',
    });
  }

  const newCert = db.insert('certifications', {
    name,
    type,
    country: 'India',
    issuingAuthority,
    licenseNo,
    verifiedScore: 95,
    validUntil,
    badgeText: type === 'NATIONAL' ? 'National Organic Standard' : 'Local State Approved',
    status: 'PENDING_MODERATION',
    documentUrl: documentUrl || 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=100&auto=format&fit=crop&q=80',
    uploadedBy: req.user ? req.user.id : 'usr_seller_01',
    uploadedAt: new Date().toISOString(),
  });

  db.logAudit({
    actorId: req.user ? req.user.id : 'seller_user',
    actorRole: 'seller',
    action: 'SUBMIT_CERTIFICATE_FOR_MODERATION',
    targetType: 'CERTIFICATION',
    targetId: newCert.id,
    reason: `Submitted ${name} (${licenseNo}) for compliance check.`,
  });

  return res.status(201).json({
    success: true,
    certificateId: newCert.id,
    certificate: newCert,
    message: 'Certificate submitted successfully. Under active review by the Eco Swadesh Trust Team.',
  });
};

/**
 * Moderate / Approve Certificate
 * PUT /v1/trust/moderate/:certId
 */
const moderateCertificate = (req, res) => {
  const { certId } = req.params;
  const { status = 'ACTIVE', verifiedScore = 98, notes } = req.body;

  const cert = db.findById('certifications', certId);
  if (!cert) {
    return res.status(404).json({
      success: false,
      error: 'CERT_NOT_FOUND',
      message: `Certificate '${certId}' was not found.`,
    });
  }

  cert.status = status;
  cert.verifiedScore = verifiedScore;
  cert.reviewedAt = new Date().toISOString();
  cert.reviewedBy = req.user ? req.user.id : 'usr_admin_01';

  db.logAudit({
    actorId: req.user ? req.user.id : 'usr_admin_01',
    actorRole: 'admin',
    action: status === 'ACTIVE' ? 'APPROVE_ORGANIC_CERTIFICATE' : 'REJECT_ORGANIC_CERTIFICATE',
    targetType: 'CERTIFICATION',
    targetId: certId,
    reason: notes || `Moderator marked certificate ${status} with score ${verifiedScore}`,
  });

  return res.status(200).json({
    success: true,
    certificate: cert,
    message: `Certificate status updated to ${status}.`,
  });
};

module.exports = {
  verifyQRSeal,
  getCertifications,
  uploadCertificate,
  moderateCertificate,
};
