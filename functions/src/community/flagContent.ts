import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Phase 6.3: Flagging & Moderation Queue Callable Function
 * Atomically increments flagCount and sets flagged: true without allowing client spamming.
 */
export const flagContent = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in first to flag content');
  }

  const { path, reason } = request.data || {};
  if (!path || typeof path !== 'string') {
    throw new HttpsError('invalid-argument', 'Valid document path is required');
  }

  const db = getFirestore();
  const docRef = db.doc(path);
  const flagUserDoc = db.doc(`${path}/flags/${request.auth.uid}`);

  await db.runTransaction(async (tx) => {
    const existingUserFlag = await tx.get(flagUserDoc);
    if (existingUserFlag.exists) {
      return; // Prevent duplicate increments by the same user
    }

    tx.set(flagUserDoc, {
      userId: request.auth!.uid,
      reason: reason || 'Inappropriate content',
      timestamp: FieldValue.serverTimestamp(),
    });

    tx.update(docRef, {
      flagged: true,
      flagCount: FieldValue.increment(1),
      lastFlaggedAt: FieldValue.serverTimestamp(),
    });
  });

  return { success: true, path };
});
