import * as functions from 'firebase-functions/v2/identity';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Phase 2.2: Automatically assign default roles upon user creation
 * Stamps { roles: ['buyer'] } on the user's custom claims and provisions /users/{uid} document.
 */
export const onUserCreate = functions.beforeUserCreated(async (event) => {
  const uid = event.data.uid;
  const defaultRoles = ['buyer'];

  const db = getFirestore();
  await db.doc(`users/${uid}`).set(
    {
      roles: defaultRoles,
      createdAt: new Date().toISOString(),
      dpdpConsentGiven: true,
      dpdpConsentTimestamp: new Date().toISOString(),
    },
    { merge: true }
  );

  return { customClaims: { roles: defaultRoles } };
});
