import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

interface RazorpaySubscriptionEntity {
  id: string;
  customer_id: string | null;
  current_end: number | null;
  notes?: { owner_id?: string };
}

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    subscription?: { entity: RazorpaySubscriptionEntity };
  };
}

async function applySubscriptionUpdate(
  admin: SupabaseClient,
  entity: RazorpaySubscriptionEntity,
  updates: Record<string, unknown>,
) {
  const { data, error } = await admin
    .from("subscriptions")
    .update(updates)
    .eq("razorpay_subscription_id", entity.id)
    .select("id");
  if (error) throw error;

  // Defensive fallback — not expected in the normal flow (the row is
  // created in createSubscriptionCheckout before checkout ever opens), but
  // if that write raced or failed, recover using the owner_id stashed in
  // notes at subscription-creation time rather than silently dropping the
  // event.
  if (data && data.length === 0 && entity.notes?.owner_id) {
    await admin.from("subscriptions").upsert(
      {
        owner_id: entity.notes.owner_id,
        razorpay_subscription_id: entity.id,
        ...updates,
      },
      { onConflict: "owner_id" },
    );
  }
}

async function handleEvent(admin: SupabaseClient, event: RazorpayWebhookEvent) {
  const entity = event.payload.subscription?.entity;
  if (!entity) return;

  const periodEnd = entity.current_end ? new Date(entity.current_end * 1000).toISOString() : null;

  switch (event.event) {
    case "subscription.activated":
      await applySubscriptionUpdate(admin, entity, {
        status: "active",
        razorpay_customer_id: entity.customer_id,
        current_period_end: periodEnd,
      });
      break;
    case "subscription.charged":
      // Fires on every successful renewal, including the first — the
      // primary signal that a cycle was actually paid for.
      await applySubscriptionUpdate(admin, entity, {
        status: "active",
        current_period_end: periodEnd,
      });
      break;
    case "subscription.completed":
      await applySubscriptionUpdate(admin, entity, { status: "completed" });
      break;
    case "subscription.cancelled":
      await applySubscriptionUpdate(admin, entity, { status: "cancelled" });
      break;
    case "subscription.halted":
      // Razorpay's own repeated-failure circuit breaker — this is the
      // authoritative "broken" signal, not a single payment.failed.
      await applySubscriptionUpdate(admin, entity, { status: "halted" });
      break;
    case "payment.failed":
      // Logged only — a single failed charge attempt doesn't necessarily
      // halt the subscription (Razorpay auto-retries); writing a status
      // here would flap on a transient card decline. subscription.halted
      // above is what actually changes state.
      console.error("Razorpay payment.failed", entity.id);
      break;
    default:
      break;
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    // Unlike the notification cron's "stub and succeed" pattern for a
    // missing RESEND_API_KEY (safe — email is best-effort), there's no safe
    // way to "process anyway" an unverifiable webhook. Fail loudly;
    // Razorpay retries until this is set.
    console.error("RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  // Raw text, not request.json() — the signature is computed over
  // Razorpay's exact byte stream; re-serializing parsed JSON risks
  // whitespace/key-order drift that would make a legitimate payload fail
  // verification. next.config.ts's serverActions.bodySizeLimit only
  // governs the "use server" RPC mechanism, not Route Handlers, so it has
  // no bearing here.
  const rawBody = await request.text();

  // Hand-rolled rather than the SDK's own Razorpay.validateWebhookSignature
  // — that helper compares with a plain `===`, which leaks timing
  // information about how many leading bytes matched. timingSafeEqual
  // avoids that side channel.
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  const valid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event: RazorpayWebhookEvent = JSON.parse(rawBody);
  const admin = createAdminClient();
  await handleEvent(admin, event);

  return NextResponse.json({ ok: true });
}
