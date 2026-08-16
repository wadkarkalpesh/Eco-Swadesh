/**
 * Eco Swadesh Cloud Functions Entrypoint
 * Microservices Architecture - Functions v2 (TypeScript)
 */

import { initializeApp } from 'firebase-admin/app';

initializeApp();

// Phase 2: Auth & Identity
export { onUserCreate } from './auth/onUserCreate';
export { addRole } from './auth/addRole';

// Phase 4: Trust & Certification
export { decideCertification } from './trust/decideCertification';
export { onCertificationChange } from './trust/onCertificationChange';
export { checkCertExpiry } from './trust/checkCertExpiry';

// Phase 5: Orders & Razorpay FinTech Gateway
export { createRazorpayOrder } from './payments/createRazorpayOrder';
export { razorpayWebhook } from './payments/razorpayWebhook';

// Phase 6: Community & Moderation
export { onAnswerCreate } from './community/onAnswerCreate';
export { flagContent } from './community/flagContent';

// Phase 7: AI Agronomy & Vision Diagnostics
export { diagnosePhoto } from './ai/diagnosePhoto';
