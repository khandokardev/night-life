import { Router, type Request } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { transactionsTable, bookingsTable } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { z } from "zod";

const STRIPE_SECRET = process.env["STRIPE_SECRET_KEY"] ?? "";
const STRIPE_WEBHOOK_SECRET = process.env["STRIPE_WEBHOOK_SECRET"] ?? "";

let stripe: Stripe | null = null;
if (STRIPE_SECRET) {
  stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2026-05-27.dahlia" });
}

const router = Router();

router.post("/create-intent", requireAuth, async (req: AuthRequest, res) => {
  if (!stripe) {
    res.status(503).json({ error: "Stripe not configured. Set STRIPE_SECRET_KEY." });
    return;
  }
  const schema = z.object({
    amount: z.number().int().positive(),
    currency: z.string().default("zar"),
    bookingId: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      metadata: { userId: String(req.userId!), bookingId: String(parsed.data.bookingId ?? "") },
    });

    const [tx] = await db.insert(transactionsTable).values({
      userId: req.userId!,
      bookingId: parsed.data.bookingId,
      stripePaymentIntentId: intent.id,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      status: "pending",
    }).returning();

    res.json({ clientSecret: intent.client_secret, transactionId: tx.id });
  } catch (err) {
    req.log.error(err, "stripe create-intent error");
    res.status(500).json({ error: "Payment error" });
  }
});

router.post("/webhook", async (req: Request, res) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    res.status(503).json({ error: "Stripe webhook not configured" });
    return;
  }
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, STRIPE_WEBHOOK_SECRET);
  } catch {
    res.status(400).json({ error: "Webhook signature verification failed" });
    return;
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await db.update(transactionsTable).set({ status: "succeeded" })
      .where(eq(transactionsTable.stripePaymentIntentId, intent.id));
    const bookingId = intent.metadata.bookingId ? Number(intent.metadata.bookingId) : null;
    if (bookingId) {
      await db.update(bookingsTable).set({ status: "confirmed" }).where(eq(bookingsTable.id, bookingId));
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await db.update(transactionsTable).set({ status: "failed" })
      .where(eq(transactionsTable.stripePaymentIntentId, intent.id));
  }

  res.json({ received: true });
});

router.get("/history", requireAuth, async (req: AuthRequest, res) => {
  const rows = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, req.userId!));
  res.json(rows);
});

export default router;
