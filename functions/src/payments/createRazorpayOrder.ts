import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { getFirestore } from 'firebase-admin/firestore';
import Razorpay from 'razorpay';

const keyId = defineSecret('RAZORPAY_KEY_ID');
const keySecret = defineSecret('RAZORPAY_KEY_SECRET');

/**
 * Phase 5.2: Server-side Razorpay Order Creation with Route Payout Splits
 * Recomputes cart total in paise from Firestore order documents.
 */
export const createRazorpayOrder = onCall(
  { secrets: [keyId, keySecret] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be signed in to create an order');
    }

    const { orderId } = request.data || {};
    if (!orderId) {
      throw new HttpsError('invalid-argument', 'orderId is required');
    }

    const db = getFirestore();
    const orderDoc = await db.doc(`orders/${orderId}`).get();
    if (!orderDoc.exists) {
      throw new HttpsError('not-found', `Order '${orderId}' not found`);
    }

    const orderData = orderDoc.data()!;
    const totalAmountINR = Number(orderData.grandTotal || orderData.totalAmount || 0);

    if (totalAmountINR <= 0) {
      throw new HttpsError('invalid-argument', 'Order total must be greater than zero');
    }

    const amountInPaise = Math.round(totalAmountINR * 100);

    const razorpay = new Razorpay({
      key_id: keyId.value(),
      key_secret: keySecret.value(),
    });

    // Compute Razorpay Route transfers if seller linked accounts exist
    const transfers: Array<{ account: string; amount: number; currency: string; notes?: Record<string, string> }> = [];
    if (Array.isArray(orderData.sellers)) {
      for (const s of orderData.sellers) {
        if (s.linkedAccountId && s.payoutPaise) {
          transfers.push({
            account: s.linkedAccountId,
            amount: s.payoutPaise,
            currency: 'INR',
            notes: { sellerId: s.sellerId, orderId },
          });
        }
      }
    }

    const orderOptions: any = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${orderId}`,
      notes: {
        orderId,
        buyerId: request.auth.uid,
        escrowPool: 'HELD_IN_ESCROW_POOL',
      },
    };

    if (transfers.length > 0) {
      orderOptions.transfers = transfers;
    }

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    await db.doc(`orders/${orderId}`).update({
      razorpayOrderId: razorpayOrder.id,
      paymentGateway: 'razorpay',
      updatedAt: new Date().toISOString(),
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    };
  }
);
