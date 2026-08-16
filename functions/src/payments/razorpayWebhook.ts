import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as crypto from 'crypto';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const keySecret = defineSecret('RAZORPAY_KEY_SECRET');

/**
 * Phase 5.3: Webhook Verification with Strict HMAC-SHA256 Signature Validation
 * Never marks payment confirmed without cryptographically authenticating the payload.
 */
export const razorpayWebhook = onRequest(
  { secrets: [keySecret] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      res.status(400).send('Missing Razorpay signature header');
      return;
    }

    const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', keySecret.value())
      .update(bodyString)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[Razorpay Webhook] Signature mismatch. Possible forged payload.');
      res.status(400).send('Invalid signature');
      return;
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const payment = payload?.payload?.payment?.entity;

    if (!payment) {
      res.status(200).send('No payment entity in webhook payload');
      return;
    }

    const orderId = payment.notes?.orderId;
    const db = getFirestore();

    // 1. Record immutable payment record
    await db.collection('payments').add({
      orderId: orderId || null,
      gatewayRef: payment.id,
      gateway: 'razorpay',
      status: 'captured',
      amount: payment.amount,
      currency: payment.currency || 'INR',
      payoutStatus: 'pending',
      timestamp: FieldValue.serverTimestamp(),
    });

    // 2. Update order status to confirmed and escrow held
    if (orderId) {
      await db.doc(`orders/${orderId}`).update({
        status: 'confirmed',
        paymentStatus: 'PAID_TO_ESCROW',
        escrowStatus: 'HELD_IN_ESCROW_POOL',
        paymentRef: payment.id,
        updatedAt: new Date().toISOString(),
      });
    }

    res.status(200).send('ok');
  }
);
