import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { reviewsTable, bookingsTable } from "@workspace/db/schema";
import { requireAuth, optionalAuth, type AuthRequest } from "../middlewares/auth.js";
import { z } from "zod";

const router = Router();

router.get("/:refType/:refId", optionalAuth, async (req, res) => {
  const rows = await db.select().from(reviewsTable).where(
    and(
      eq(reviewsTable.refType, req.params.refType as string),
      eq(reviewsTable.refId, Number(req.params.refId)),
      eq(reviewsTable.approved, true)
    )
  );
  res.json(rows);
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({
    refType: z.string(),
    refId: z.number().int(),
    bookingId: z.number().int().optional(),
    rating: z.number().int().min(1).max(5),
    body: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  if (parsed.data.bookingId) {
    const [booking] = await db.select().from(bookingsTable).where(
      and(eq(bookingsTable.id, parsed.data.bookingId), eq(bookingsTable.userId, req.userId!))
    ).limit(1);
    if (!booking || booking.status !== "confirmed") {
      res.status(403).json({ error: "Reviews require a confirmed booking" });
      return;
    }
  }

  const existing = await db.select().from(reviewsTable).where(
    and(eq(reviewsTable.userId, req.userId!), eq(reviewsTable.refType, parsed.data.refType), eq(reviewsTable.refId, parsed.data.refId))
  ).limit(1);
  if (existing.length > 0) { res.status(409).json({ error: "Already reviewed" }); return; }

  const [row] = await db.insert(reviewsTable).values({ userId: req.userId!, ...parsed.data }).returning();
  res.status(201).json(row);
});

export default router;
