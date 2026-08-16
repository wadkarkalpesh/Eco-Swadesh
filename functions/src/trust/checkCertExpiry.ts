import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

/**
 * Phase 4.4: Daily scheduled check for certifications expiring within 30 or 7 days
 * Generates proactive alerts in notifications/{producerId}/items.
 */
export const checkCertExpiry = onSchedule('every day 06:00', async () => {
  const db = getFirestore();
  const now = Date.now();
  const in30Days = Timestamp.fromMillis(now + 30 * 86400000);

  const snapshot = await db
    .collection('certifications')
    .where('status', 'in', ['approved', 'ACTIVE'])
    .where('validTo', '<=', in30Days)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const producerId = data.producerId || data.uploadedBy;

    if (producerId) {
      await db.collection(`notifications/${producerId}/items`).add({
        type: 'certification_expiring',
        title: 'Certification Expiry Alert',
        message: `Your certificate '${data.name || data.licenseNo}' is approaching expiry. Please submit renewal documents.`,
        payload: {
          certificationId: doc.id,
          licenseNo: data.licenseNo,
          validTo: data.validTo,
        },
        read: false,
        createdAt: Timestamp.now(),
      });
    }
  }
});
