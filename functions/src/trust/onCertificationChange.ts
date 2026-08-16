import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Phase 4.3: Automated Trust Score / Trust Label computation
 * Recalculates listing trustLabel ('verified' | 'pending' | 'unverified')
 * whenever a certification's status changes.
 */
export const onCertificationChange = onDocumentUpdated('certifications/{certId}', async (event) => {
  const after = event.data?.after.data();
  if (!after) return;

  const listingId = after.listingId;
  if (!listingId) return;

  const trustLabel =
    after.status === 'approved' || after.status === 'ACTIVE'
      ? 'verified'
      : after.status === 'pending' || after.status === 'PENDING_MODERATION'
      ? 'pending'
      : 'unverified';

  const db = getFirestore();
  await db.doc(`listings/${listingId}`).update({
    trustLabel,
    updatedAt: new Date().toISOString(),
  });
});
