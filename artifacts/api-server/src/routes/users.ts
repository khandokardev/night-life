import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { usersTable, savedItemsTable } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { z } from "zod";

const router = Router();
router.use(requireAuth);

router.get("/me", async (req: AuthRequest, res) => {
  const [user] = await db.select({
    id: usersTable.id, name: usersTable.name, email: usersTable.email,
    phone: usersTable.phone, avatar: usersTable.avatar, role: usersTable.role, createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
});

router.patch("/me", async (req: AuthRequest, res) => {
  const schema = z.object({
    name: z.string().min(1).optional(),
    avatar: z.string().optional(),
    phone: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [updated] = await db.update(usersTable).set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(usersTable.id, req.userId!)).returning({
      id: usersTable.id, name: usersTable.name, email: usersTable.email, phone: usersTable.phone, avatar: usersTable.avatar,
    });
  res.json(updated);
});

router.get("/me/saved", async (req: AuthRequest, res) => {
  const rows = await db.select().from(savedItemsTable).where(eq(savedItemsTable.userId, req.userId!));
  res.json(rows);
});

router.post("/me/saved", async (req: AuthRequest, res) => {
  const schema = z.object({ refType: z.string(), refId: z.number().int() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const existing = await db.select().from(savedItemsTable).where(
    and(eq(savedItemsTable.userId, req.userId!), eq(savedItemsTable.refType, parsed.data.refType), eq(savedItemsTable.refId, parsed.data.refId))
  ).limit(1);
  if (existing.length > 0) { res.status(409).json({ error: "Already saved" }); return; }
  const [row] = await db.insert(savedItemsTable).values({ userId: req.userId!, ...parsed.data }).returning();
  res.status(201).json(row);
});

router.delete("/me/saved/:id", async (req: AuthRequest, res) => {
  await db.delete(savedItemsTable).where(
    and(eq(savedItemsTable.id, Number(req.params.id)), eq(savedItemsTable.userId, req.userId!))
  );
  res.json({ ok: true });
});

export default router;
