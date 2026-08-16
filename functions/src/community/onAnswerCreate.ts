import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Phase 6.1: Expert-Answer Denormalization Trigger
 * Reads the author's custom claims server-side and stamps isExpertAnswer onto the document.
 * Prevents client-side manipulation of verified expert status.
 */
export const onAnswerCreate = onDocumentCreated(
  'questions/{questionId}/answers/{answerId}',
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const authorId = data.authorId;
    if (!authorId) return;

    const auth = getAuth();
    let isExpert = false;

    try {
      const user = await auth.getUser(authorId);
      const roles = (user.customClaims?.roles as string[]) || [];
      isExpert = roles.includes('expert');
    } catch (err) {
      console.warn(`[onAnswerCreate] Failed to fetch auth claims for ${authorId}`, err);
    }

    const db = getFirestore();
    await db
      .doc(`questions/${event.params.questionId}/answers/${event.params.answerId}`)
      .update({
        isExpertAnswer: isExpert,
        authorVerified: isExpert,
        verifiedAt: new Date().toISOString(),
      });
  }
);
