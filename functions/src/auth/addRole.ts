import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const SELF_ASSIGNABLE = ['buyer', 'seller', 'gardener'];

/**
 * Phase 2.2: Add self-assignable roles (buyer, seller, gardener)
 * Privileged roles (expert, moderator, admin) are protected and cannot be self-assigned.
 */
export const addRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in first');
  }

  const role = request.data?.role;
  if (!role || typeof role !== 'string') {
    throw new HttpsError('invalid-argument', 'Role parameter is required');
  }

  if (!SELF_ASSIGNABLE.includes(role)) {
    throw new HttpsError(
      'permission-denied',
      `Role '${role}' cannot be self-assigned. Moderator or administrator authorization required.`
    );
  }

  const auth = getAuth();
  const user = await auth.getUser(request.auth.uid);
  const currentRoles = (user.customClaims?.roles as string[]) || ['buyer'];
  const newRoles = Array.from(new Set([...currentRoles, role]));

  await auth.setCustomUserClaims(request.auth.uid, { roles: newRoles });

  // Sync to users collection in Firestore
  const db = getFirestore();
  await db.doc(`users/${request.auth.uid}`).set(
    {
      roles: newRoles,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return { roles: newRoles };
});
