import { Router } from "express";
import { eq, and } from "drizzle-orm";
import QRCode from "qrcode";
import { db } from "@workspace/db";
import { bookingsTable, createBookingSchema } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const rows = await db.select().from(bookingsTable).where(eq(bookingsTable.userId, req.userId!));
  res.json(rows);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const [row] = await db.select().from(bookingsTable).where(
    and(eq(bookingsTable.id, Number(req.params.id)), eq(bookingsTable.userId, req.userId!))
  ).limit(1);
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.post("/", async (req: AuthRequest, res) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const data = parsed.data;
    const [booking] = await db.insert(bookingsTable).values({
      userId: req.userId!,
      ...data,
      totalAmount: data.totalAmount,
    }).returning();

    const qrData = JSON.stringify({ bookingId: booking.id, type: booking.bookingType, ref: booking.refId, date: booking.date });
    const qrCode = await QRCode.toDataURL(qrData);

    const [updated] = await db.update(bookingsTable).set({ qrCode }).where(eq(bookingsTable.id, booking.id)).returning();
    res.status(201).json(updated);
  } catch (err) {
    req.log.error(err, "create booking error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id/cancel", async (req: AuthRequest, res) => {
  const [existing] = await db.select().from(bookingsTable).where(
    and(eq(bookingsTable.id, Number(req.params.id)), eq(bookingsTable.userId, req.userId!))
  ).limit(1);
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }
  if (existing.status === "cancelled") { res.status(400).json({ error: "Already cancelled" }); return; }
  const [updated] = await db.update(bookingsTable).set({ status: "cancelled" }).where(eq(bookingsTable.id, existing.id)).returning();
  res.json(updated);
});

export default router;
