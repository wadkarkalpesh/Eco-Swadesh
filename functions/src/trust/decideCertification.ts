import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Phase 4.2: Moderator Decision on Certification with Immutable Server-Only Audit Log
 */
export const decideCertification = onCall(async (request) => {
  const claims = request.auth?.token;
  const roles = (claims?.roles as string[]) || [];

  if (!claims || !(roles.includes('moderator') || roles.includes('admin'))) {
    throw new HttpsError('permission-denied', 'Moderator or Admin role required');
  }

  const { certificationId, decision, reason } = request.data || {};

  if (!certificationId) {
    throw new HttpsError('invalid-argument', 'certificationId is required');
  }

  if (!['approved', 'rejected'].includes(decision)) {
    throw new HttpsError('invalid-argument', 'decision must be approved or rejected');
  }

  const db = getFirestore();
  const certRef = db.doc(`certifications/${certificationId}`);

  await db.runTransaction(async (tx) => {
    const certDoc = await tx.get(certRef);
    if (!certDoc.exists) {
      throw new HttpsError('not-found', `Certification '${certificationId}' not found`);
    }

    tx.update(certRef, {
      status: decision,
      verifiedBy: request.auth!.uid,
      verifiedAt: FieldValue.serverTimestamp(),
    });

    // Write immutable audit log entry
    const auditRef = db.collection('auditLog').doc();
    tx.set(auditRef, {
      actorId: request.auth!.uid,
      actorRole: roles.includes('admin') ? 'admin' : 'moderator',
      action: `certification_${decision}`,
      targetType: 'certification',
      targetId: certificationId,
      reason: reason || null,
      timestamp: FieldValue.serverTimestamp(),
    });
  });

  return { certificationId, status: decision };
});
