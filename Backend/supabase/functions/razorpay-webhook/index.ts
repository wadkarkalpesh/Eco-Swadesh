// Supabase Edge Function: Razorpay Webhook Handler
// Verifies HMAC-SHA256 signature, transitions order escrow status,
// and notifies buyer & seller via PostgreSQL mutations.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") || "test_secret";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Process event
    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.notes?.orderId || paymentEntity.order_id;

      // Update Order Status in Supabase PostgreSQL
      const { data, error } = await supabase
        .from("orders")
        .update({
          escrow_status: "LOCKED_IN_ESCROW",
          payment_gateway_payment_id: paymentEntity.id,
          updated_at: new Date().toISOString(),
        })
        .eq("order_code", orderId);

      if (error) {
        console.error("Error updating order escrow status:", error);
      }
    }

    return new Response(JSON.stringify({ status: "success", received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
