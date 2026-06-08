import { Router } from "express";
import { eq, and, or, isNull } from "drizzle-orm";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const rows = await db.select().from(notificationsTable).where(
    or(eq(notificationsTable.userId, req.userId!), isNull(notificationsTable.userId))
  ).orderBy(notificationsTable.createdAt);
  res.json(rows);
});

router.patch("/:id/read", async (req: AuthRequest, res) => {
  const [updated] = await db.update(notificationsTable).set({ read: true }).where(
    and(eq(notificationsTable.id, Number(req.params.id)), eq(notificationsTable.userId, req.userId!))
  ).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

router.patch("/read-all", async (req: AuthRequest, res) => {
  await db.update(notificationsTable).set({ read: true }).where(eq(notificationsTable.userId, req.userId!));
  res.json({ ok: true });
});

export default router;
